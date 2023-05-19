import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DefaultListDto } from '../../../shared/dto/default-list-dto';
import { UserRole } from '../schemas/user.schema';

export class GetUserDto extends DefaultListDto {
	@IsEnum(UserRole)
	@IsOptional()
	@ApiProperty({ enum: UserRole, required: false })
	role?: UserRole;
}
