import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user-dto';

export class UpdateLoggedUserDataDto extends PickType(UpdateUserDto, [
	'username',
	'email',
	'displayName',
	'firstName',
	'lastName',
	'gender',
	'birthDate',
	'tel',
	'address',
] as const) {}
