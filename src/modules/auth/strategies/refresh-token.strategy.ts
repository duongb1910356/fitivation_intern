import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../types/token-payload.type';
import { TokenPayloadWithRefreshToken } from '../types/token-payload-with-rt.type';
import { Request } from 'express';

export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				RefreshTokenStrategy.extractJwtFromCookie,
			]),
			secretOrKey: `${process.env.JWT_RT_SECRET}`,
			passReqToCallback: true,
		});
	}
	async validate(
		req: Request,
		payload: TokenPayload,
	): Promise<TokenPayloadWithRefreshToken> {
		const refreshToken = req.cookies.refreshToken;

		return { ...payload, refreshToken };
	}

	private static extractJwtFromCookie(req: Request): string | null {
		if (req.cookies && req.cookies.refreshToken) {
			return req.cookies.refreshToken;
		}
		return null;
	}
}
