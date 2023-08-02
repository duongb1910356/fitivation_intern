import { CreateUserDto } from 'src/modules/users/dto/create-user-dto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class SignupAsFacilityOwnerDto extends PartialType(
	OmitType(CreateUserDto, ['isMember', 'status'] as const),
) {}
