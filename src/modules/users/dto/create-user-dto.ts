import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { Gender, UserRole, UserStatus } from '../schemas/user.schema';
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
	birthDate: Date;

	@IsNotEmpty()
	@IsPhoneNumber()
	tel: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => UserAddressDto)
	address: UserAddressDto;

	@IsOptional()
	@IsString()
	avatar?: string;

	@IsOptional()
	@IsBoolean()
	isMember?: boolean;
}
