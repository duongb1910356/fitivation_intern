import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { SignupDto } from './dto/signup-dto';
import { TokenResponse } from './types/token-response.types';
import { ErrorResponse } from 'src/shared/response/common-response';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'signup', description: 'Allow user sign up' })
	@ApiBody({
		type: SignupDto,
		examples: {
			USER: {
				summary: 'User',
				value: {
					username: 'test1',
					email: 'test1@test.com',
					password: '123123123',
					displayName: 'User1',
				} as SignupDto,
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accessToken: 'string',
				refreshToken: 'string',
			} as TokenResponse,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('signup')
	@Public()
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() signupDto: SignupDto): Promise<TokenResponse> {
		return this.authService.signup(signupDto);
	}

	@ApiOperation({ summary: 'login', description: 'Allow user login' })
	@ApiBody({
		type: LoginDto,
		examples: {
			ADMIN: {
				summary: 'Admin',
				value: {
					email: 'test1@test.com',
					password: '123123123',
				} as LoginDto,
			},
			USER: {
				summary: 'User',
				value: {
					email: 'test2@test.com',
					password: '123123123',
				} as LoginDto,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				accessToken: 'string',
				refreshToken: 'string',
			} as TokenResponse,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
		return this.authService.login(loginDto);
	}

	@ApiOperation({ summary: 'logout', description: 'Allow user log out' })
	@ApiResponse({ status: 204 })
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@GetCurrentUser('sub') userID: string): Promise<boolean> {
		return this.authService.logout(userID);
	}

	@ApiOperation({ summary: 'refreshToken', description: 'Refresh new token' })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accessToken: 'string',
				refreshToken: 'string',
			} as TokenResponse,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Token invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('refresh-token')
	@Public()
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.OK)
	refreshTokens(
		@GetCurrentUser('sub') userID: string,
		@GetCurrentUser('refreshToken') refreshToken: string,
	): Promise<TokenResponse> {
		return this.authService.refreshTokens(userID, refreshToken);
	}

	@ApiOperation({
		summary: 'forgotPassword',
		description: 'Allow user send forgot password request to reset password',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'Token sent to email',
			},
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('forgot-password')
	forgotPassword() {
		return 'forgotPassword';
	}

	@ApiOperation({
		summary: 'resetPassword',
		description: 'Allow user reset password',
	})
	@ApiParam({
		name: 'resetPasswordToken',
		type: String,
		description: 'Reset Password Token',
	})
	@ApiCreatedResponse({ type: TokenResponse, status: 200 })
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Reset Password token invalid  or has expired',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Patch('reset-password/:resetPasswordToken')
	resetPassword() {
		return 'resetPassword';
	}
}
