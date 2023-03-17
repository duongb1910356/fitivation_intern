import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { Password } from 'src/utils/password';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { RegisterDto } from './dto/register-dto';
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
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get loggedIn user info ' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
