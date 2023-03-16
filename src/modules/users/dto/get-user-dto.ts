import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { UserRole } from '../schemas/user.schema';

export class GetUserDto extends DefaultListDto {
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, required: false })
  role: UserRole;
}
