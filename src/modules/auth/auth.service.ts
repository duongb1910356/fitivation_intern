import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from 'src/app.config';
import { User } from 'src/modules/users/schemas/user.schema';
import { TokenPayloadDto } from './dto/token-payload-dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: User) {
    const payload: TokenPayloadDto = {
      iss: appConfig.name,
      sub: user._id.toString(),
      nam: user.displayName,
      rol: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
