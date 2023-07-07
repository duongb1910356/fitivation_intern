import {
	IsDate,
	IsEmail,
	IsEnum,
	IsMobilePhone,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, UserRole } from '../schemas/user.schema';
import { UserAddressDto } from './user-address.dto';

export class UpdateUserDto {
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(40)
	username?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	password?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(20)
	displayName?: string;

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
	@IsString()
	refreshToken?: string;
}
