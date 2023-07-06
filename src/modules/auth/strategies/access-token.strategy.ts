import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { appConfig } from '../../../app.config';
import { TokenPayload } from '../types/token-payload.type';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				AccessTokenStrategy.extractJwtFromCookie,
			]),
			ignoreExpiration: false,
			secretOrKey: `${appConfig.jwtAccessSecret}`,
		});
	}

	async validate(payload: TokenPayload): Promise<TokenPayload> {
		return payload;
	}

	private static extractJwtFromCookie(req: Request): string | null {
		if (req.cookies && req.cookies.accessToken) {
			return req.cookies.accessToken;
		}
		return null;
	}
}
