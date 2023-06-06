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
	displayName: string;

	@IsEmail()
	email: string;

	@MinLength(6)
	password: string;

	@IsEnum(UserRole)
	role: UserRole;

	@IsOptional()
	avatar?: string;
}
