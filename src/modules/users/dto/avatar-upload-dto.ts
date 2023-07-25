import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AvatarUploadDto {
	@ApiProperty({ type: 'string', format: 'binary' })
	avatar: any;
}
