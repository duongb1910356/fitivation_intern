import { IsNotEmpty, IsString } from 'class-validator';

export class TokenResponse {
	@IsString()
	@IsNotEmpty()
	accessToken: string;

	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}
