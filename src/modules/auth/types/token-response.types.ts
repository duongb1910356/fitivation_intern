import { IsNotEmpty, IsString } from 'class-validator';

export class TokenResponse {
	@IsNotEmpty()
	@IsString()
	accessToken: string;

	@IsNotEmpty()
	@IsString()
	refreshToken: string;

	@IsNotEmpty()
	@IsString()
	role: string;
}
