import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Request,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../../modules/users/users.service';
import { Password } from '../../utils/password';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { RegisterDto } from './dto/register-dto';
import { TokenResponse } from './dto/token-payload-dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './utils';
import { ErrorResponse } from 'src/shared/response/common-response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}

	@Public()
	@Post('login')
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
	@ApiCreatedResponse({ type: TokenResponse, status: 201 })
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
	async login(@Body() loginDto: LoginDto) {
		const user = await this.userService.findOne({ email: loginDto.email });
		if (!user) throw new UnauthorizedException();

		const isMatchPassword = await Password.comparePassword(
			user.password,
			loginDto.password,
		);
		if (!isMatchPassword) {
			throw new UnauthorizedException();
		}
		return this.authService.login(user);
	}

	@Public()
	@Post('register')
	@ApiOperation({ summary: 'register', description: 'Allow user sign up' })
	@ApiBody({
		type: RegisterDto,
		examples: {
			USER: {
				summary: 'User',
				value: {
					email: 'test1@test.com',
					password: '123123123',
				} as RegisterDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				status: '201',
				message: 'Register success!',
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
	async register(@Body() registerDto: RegisterDto) {
		const user = await this.userService.findOne({ email: registerDto.email });
		if (user) {
			throw new BadRequestException('User has existed!');
		}
		return this.authService.register(registerDto);
	}

	@Public()
	@Post('refresh-token')
	@ApiOperation({ summary: 'refreshToken', description: 'Refresh new token' })
	@ApiCreatedResponse({ type: TokenResponse, status: 201 })
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
	refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'getProfile',
		description: 'Get loggedIn user info',
	})
	@ApiResponse({ type: User, status: 200 })
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
	getProfile(@Request() req: any) {
		return this.userService.findOne(req.uid);
	}

	@Public()
	@Post('forgot-password')
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
	forgotPassword() {
		return 'forgotPassword';
	}

	@Public()
	@Patch('reset-password/:resetPasswordToken')
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
	resetPassword() {
		return 'resetPassword';
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update-password')
	@ApiOperation({
		summary: 'updatePassword',
		description: 'Allow user update password',
	})
	@ApiCreatedResponse({ type: TokenResponse, status: 200 })
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
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	updatePassword() {
		return 'updatePassword';
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update-me')
	@ApiOperation({
		summary: 'updateMe',
		description: 'Allow user update personal account data',
	})
	@ApiCreatedResponse({ type: TokenResponse, status: 200 })
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
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	updateMe() {
		return 'updateMe';
	}

	@UseGuards(JwtAuthGuard)
	@Delete('delete-me')
	@ApiOperation({
		summary: 'deleteMe',
		description: 'Allow user inactive personal account data',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'This account will delete after 15 days no login',
				details: null,
			},
		},
	})
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
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deleteMe() {
		return 'deleteMe';
	}
}
