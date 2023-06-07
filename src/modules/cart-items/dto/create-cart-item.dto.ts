import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageID: string;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	promotionIDs: string[];
}
