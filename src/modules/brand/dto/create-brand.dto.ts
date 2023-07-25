import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
	@ApiProperty({ example: 'Example Name' })
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	accountID?: string;
}
