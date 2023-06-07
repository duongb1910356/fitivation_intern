import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';

export class GetUserDto extends PartialType(
	PickType(CreateUserDto, [
		'displayName',
		'birthDate',
		'address',
		'firstName',
		'lastName',
		'gender',
		'tel',
	]),
) {}
