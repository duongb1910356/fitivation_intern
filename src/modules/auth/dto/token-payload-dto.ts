import { IsString } from 'class-validator';

export class TokenPayloadDto {
	sub: string;
	iss: string;
	nam: string;
	rol: string;
}

export class TokenResponse {
	@IsString()
	access_token: string;

	@IsString()
	refresh_token: string;
}
