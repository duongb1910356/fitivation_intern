import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	MaxLength,
	MinLength,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
	@MinLength(3)
	@MaxLength(12)
	@ApiProperty()
	displayName: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@MinLength(6)
	@ApiProperty()
	password: string;

	@IsEnum(UserRole)
	@ApiProperty()
	role: UserRole;

	@IsOptional()
	@ApiProperty()
	avatar?: string;
}
