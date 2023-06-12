import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';
import { IsEnum, IsString } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class UpdateUserDto extends PickType(CreateUserDto, [
	'username',
	'email',
	'password',
	'displayName',
	'lastName',
	'firstName',
	'birthDate',
	'gender',
	'isMember',
	'tel',
	'address',
]) {
	@IsString()
	id: string;

	@IsEnum(UserStatus)
	status: UserStatus;
}
