import { CreateUserDto } from 'src/modules/users/dto/create-user-dto';
import { PartialType, OmitType } from '@nestjs/swagger';

export class SignupDtoAsFacilityOwner extends PartialType(
	OmitType(CreateUserDto, ['isMember', 'status'] as const),
) {}
