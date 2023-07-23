import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
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
import { UserRole } from '../users/schemas/user.schema';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'signup',
		description: 'Allow user sign up.\n\nRoles: none.',
	})
	@ApiBody({
		type: SignupDto,
		examples: {
			CUSTOMER: {
				summary: 'Sign up customer account',
				value: {
					username: 'customer1',
					email: 'customer1@test.com',
					password: '123123123',
					displayName: 'Customer User',
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

	@ApiOperation({
		summary: 'login',
		description: 'Allow user login.\n\nRoles: none.',
	})
	@ApiBody({
		type: LoginDto,
		examples: {
			ADMIN: {
				summary: 'Admin account',
				value: {
					email: 'admin@test.com',
					password: '123123123',
				} as LoginDto,
			},
			CUSTOMER: {
				summary: 'Customer account',
				value: {
					email: 'customer1@test.com',
					password: '123123123',
				} as LoginDto,
			},
			FACILITY_OWNER: {
				summary: 'Facility Owner account',
				value: {
					email: 'owner1@test.com',
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

	@ApiOperation({
		summary: 'logout',
		description: `Allow user log out.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
	})
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
	@ApiBearerAuth()
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@GetCurrentUser('sub') userID: string): Promise<boolean> {
		return this.authService.logout(userID);
	}

	@ApiOperation({
		summary: 'refreshToken',
		description: `Refresh new token.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}.`,
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
				message: 'Token invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBearerAuth()
	@Post('refresh-token')
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.OK)
	refreshTokens(
		@GetCurrentUser('sub') userID: string,
		@GetCurrentUser('refreshToken') refreshToken: string,
	): Promise<TokenResponse> {
		return this.authService.refreshTokens(userID, refreshToken);
	}

	// @ApiOperation({
	// 	summary: 'forgotPassword',
	// 	description: 'Allow user send forgot password request to reset password',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			code: '200',
	// 			message: 'Token sent to email',
	// 		},
	// 	},
	// })
	// @ApiResponse({
	// 	status: 400,
	// 	schema: {
	// 		example: {
	// 			code: '400',
	// 			message: 'Input invalid',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Post('forgot-password')
	// forgotPassword() {
	// 	return 'forgotPassword';
	// }

	// @ApiOperation({
	// 	summary: 'resetPassword',
	// 	description: 'Allow user reset password',
	// })
	// @ApiParam({
	// 	name: 'resetPasswordToken',
	// 	type: String,
	// 	description: 'Reset Password Token',
	// })
	// @ApiCreatedResponse({ type: TokenResponse, status: 200 })
	// @ApiResponse({
	// 	status: 400,
	// 	schema: {
	// 		example: {
	// 			code: '400',
	// 			message: 'Reset Password token invalid  or has expired',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Patch('reset-password/:resetPasswordToken')
	// resetPassword() {
	// 	return 'resetPassword';
	// }
}
