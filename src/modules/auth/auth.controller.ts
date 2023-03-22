import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponse } from '../../shared/response/success-response';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @Post('login')
  @ApiResponse({ type: TokenResponse, status: 200 })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnAuthorization',
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
  @ApiResponse({ type: SuccessResponse<any>, status: 200 })
  @ApiBadRequestResponse({
    type: 'string',
    status: 400,
    description: '[Input] invalid',
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
  @ApiOperation({ description: 'Refresh new token' })
  @ApiResponse({ type: TokenResponse, status: 200 })
  @ApiUnauthorizedResponse({
    type: 'string',
    status: 400,
    description: 'Token invalid',
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get loggedIn user info ' })
  @ApiResponse({ type: User, status: 200 })
  @ApiUnauthorizedResponse({
    type: 'string',
    status: 400,
    description: 'Token invalid',
  })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
