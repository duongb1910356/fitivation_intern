import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup-dto';
import { TokenResponse } from './types/token-response.types';
import { TokenPayload } from './types/token-payload.type';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../../app.config';
import { Encrypt } from 'src/shared/utils/encrypt';
import { LoginDto } from './dto/login-dto';
import { UserStatus } from '../users/schemas/user.schema';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	sendTokensToCookie(tokenResponse: TokenResponse, res: Response) {
		res.cookie('accessToken', tokenResponse.accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		res.cookie('refreshToken', tokenResponse.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});
	}

	async signTokens(
		sub: string,
		email: string,
		role: string,
	): Promise<TokenResponse> {
		const tokenPayload: TokenPayload = {
			sub,
			email,
			role,
		};

		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(tokenPayload, {
				secret: `${appConfig.jwtAccessSecret}`,
				expiresIn: `${appConfig.jwtAccessExpiresIn}`,
			}),
			this.jwtService.signAsync(tokenPayload, {
				secret: `${appConfig.jwtRefreshSecret}`,
				expiresIn: `${appConfig.jwtRefreshExpiresIn}`,
			}),
		]).catch(async () => {
			throw new InternalServerErrorException('Sign token failed');
		});

		return {
			accessToken: at,
			refreshToken: rt,
		};
	}

	async updateRefreshTokenHashed(userID: string, rt: string): Promise<void> {
		const refreshToken = await Encrypt.hashData(rt);
		await this.userService.findOneByIDAndUpdate(userID, {
			refreshToken,
		});
	}

	async signup(signupDto: SignupDto, res: Response): Promise<TokenResponse> {
		const newUser = await this.userService.createOne(signupDto);

		const tokens = await this.signTokens(
			newUser._id,
			newUser.email,
			newUser.role,
		);

		await this.updateRefreshTokenHashed(newUser._id, tokens.refreshToken);

		this.sendTokensToCookie(tokens, res);

		return tokens;
	}

	async login(loginDto: LoginDto, res: Response): Promise<TokenResponse> {
		const user = await this.userService.findOneByEmail(loginDto.email);

		if (user.status === UserStatus.INACTIVE) {
			throw new BadRequestException('User status inactive');
		}

		const isMatched = await Encrypt.compareData(
			user.password,
			loginDto.password,
		);

		if (!isMatched) throw new BadRequestException('Password not correct');

		const tokens = await this.signTokens(user._id, user.email, user.role);

		await this.updateRefreshTokenHashed(user._id, tokens.refreshToken);

		this.sendTokensToCookie(tokens, res);

		return tokens;
	}

	async logout(userID: string, res: Response): Promise<boolean> {
		const user = await this.userService.findOneByID(userID);

		if (user.refreshToken === null)
			throw new BadRequestException('User already logout');

		await this.userService.findOneByIDAndUpdate(userID, {
			refreshToken: null,
		});

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

		return true;
	}

	async refreshTokens(
		userID: string,
		refreshToken: string,
		res: Response,
	): Promise<TokenResponse> {
		const user = await this.userService.findOneByID(userID);

		if (!user.refreshToken) throw new UnauthorizedException('Unauthorized');

		const isMatched = await Encrypt.compareData(
			user.refreshToken,
			refreshToken,
		);

		if (!isMatched) throw new UnauthorizedException('Unauthorized');

		const tokens = await this.signTokens(user._id, user.email, user.role);

		await this.updateRefreshTokenHashed(user._id, tokens.refreshToken);

		this.sendTokensToCookie(tokens, res);

		return tokens;
	}
}
