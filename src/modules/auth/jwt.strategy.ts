import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { appConfig } from '../../app.config';
import { TokenPayloadDto } from './dto/token-payload-dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  async validate(payload: TokenPayloadDto) {
    return {
      uid: payload.sub,
      name: payload.nam,
      role: payload.rol,
    };
  }
}
