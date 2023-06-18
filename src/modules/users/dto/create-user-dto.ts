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
	@IsNotEmpty()
	@IsEnum(UserRole)
	role: UserRole;

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

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(20)
	firstName: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(40)
	lastName: string;

	@IsNotEmpty()
	@IsEnum(Gender)
	gender: Gender;

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	birthDate: Date;

	@IsNotEmpty()
	@IsMobilePhone('vi-VN')
	tel: string;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => UserAddressDto)
	address: UserAddressDto;

	@IsOptional()
	@IsBoolean()
	isMember?: boolean;
}
