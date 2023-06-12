import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';
import { IsEnum } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class UpdateUserDto extends PickType(CreateUserDto, [
	'email',
	'displayName',
	'lastName',
	'firstName',
	'birthDate',
	'avatar',
	'gender',
	'isMember',
]) {
	@IsEnum(UserStatus)
	status: UserStatus;
}
