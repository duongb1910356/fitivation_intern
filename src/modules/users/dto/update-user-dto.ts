import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
	PickType(CreateUserDto, [
		'email',
		'password',
		'displayName',
		'lastName',
		'firstName',
		'birthDate',
		'avatar',
		'gender',
		'role',
		'isMember',
		'status',
	]),
) {
	@IsString()
	id: string;
}
