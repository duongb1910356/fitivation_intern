import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../../app.config';
import { User } from '../../modules/users/schemas/user.schema';
import { SuccessResponse } from '../../shared/response/success-response';
import { Password } from '../../utils/password';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { RegisterDto } from './dto/register-dto';
import { TokenPayloadDto } from './dto/token-payload-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(user: User) {
    const payload: TokenPayloadDto = {
      iss: appConfig.name,
      sub: user._id.toString(),
      nam: user.displayName,
      rol: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: appConfig.jwtRefreshSecret,
        expiresIn: appConfig.jwtRefreshExp,
      }),
    };
  }

  async register(input: RegisterDto): Promise<SuccessResponse<RegisterDto>> {
    try {
      input.password = await Password.hashPassword(input.password);
      const user = this.userService.createOne(input);

      if (user) {
        return;
      }
      throw new BadRequestException('Create user failed!');
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async refreshToken({ token }: RefreshTokenDto): Promise<any> {
    const payload: TokenPayloadDto = this.jwtService.verify(token, {
      secret: appConfig.jwtRefreshSecret,
    });
    if (payload) {
      const { iss, sub, nam, rol } = payload;
      const signPayload: TokenPayloadDto = {
        iss,
        sub,
        nam,
        rol,
      };
      return {
        access_token: this.jwtService.sign(signPayload),
        refresh_token: this.jwtService.sign(signPayload, {
          secret: appConfig.jwtRefreshSecret,
          expiresIn: appConfig.jwtRefreshExp,
        }),
      };
    }
    throw new UnauthorizedException();
  }
}
