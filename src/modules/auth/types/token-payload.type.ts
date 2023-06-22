import { IsNotEmpty, IsString } from 'class-validator';

export class TokenPayload {
	@IsString()
	@IsNotEmpty()
	sub: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	role: string;
}
