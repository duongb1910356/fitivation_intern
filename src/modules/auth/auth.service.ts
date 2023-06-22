import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup-dto';
import { TokenResponse } from './types/token-response.types';
import { TokenPayload } from './types/token-payload.type';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../../app.config';
import { Encrypt } from 'src/shared/utils/encrypt';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

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
			await this.userService.deleteOne(sub);
			throw new InternalServerErrorException('Sign token failed');
		});

		return {
			accessToken: at,
			refreshToken: rt,
		};
	}

	async updateRefreshTokenHashed(userID: string, rt: string): Promise<void> {
		const refreshToken = await Encrypt.hashData(rt);
		await this.userService.findByIDAndUpdate(userID, {
			refreshToken,
		});
	}

	async signup(signupDto: SignupDto): Promise<TokenResponse> {
		const passwordHashed = await Encrypt.hashData(signupDto.password);

		const newUser = await this.userService.createOne({
			username: signupDto.username,
			email: signupDto.email,
			password: passwordHashed,
			displayName: signupDto.displayName,
		});

		const tokens = await this.signTokens(
			newUser._id,
			newUser.email,
			newUser.role,
		);

		await this.updateRefreshTokenHashed(newUser._id, tokens.refreshToken);

		return tokens;
	}

	async login(loginDto: LoginDto): Promise<TokenResponse> {
		const user = await this.userService.findOneByEmail(loginDto.email);

		const isMatched = await Encrypt.compareData(
			user.password,
			loginDto.password,
		);

		if (!isMatched) throw new BadRequestException('Password not correct');

		const tokens = await this.signTokens(user._id, user.email, user.role);

		await this.updateRefreshTokenHashed(user._id, tokens.refreshToken);

		return tokens;
	}

	async logout() {
		//
	}

	async refreshTokens() {
		//
	}
}
