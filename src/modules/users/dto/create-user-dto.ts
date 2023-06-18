import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { Gender, UserRole } from '../schemas/user.schema';
import { UserAddressDto } from './user-address.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(40)
	username: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(20)
	displayName: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(20)
	firstName?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(40)
	lastName?: string;

	@IsOptional()
	@IsEnum(Gender)
	gender?: Gender;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	birthDate?: Date;

	@IsOptional()
	@IsMobilePhone('vi-VN')
	tel?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => UserAddressDto)
	address?: UserAddressDto;

	@IsOptional()
	@IsBoolean()
	isMember?: boolean;
}
