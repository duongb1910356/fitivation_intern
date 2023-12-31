import { IsNotEmpty, IsString } from 'class-validator';

export class TokenPayload {
	@IsNotEmpty()
	@IsString()
	sub: string;

	@IsNotEmpty()
	@IsString()
	role: string;
}
