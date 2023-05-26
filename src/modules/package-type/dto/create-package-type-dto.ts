import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreatePackageTypeDto {
	@IsMongoId()
	@ApiProperty()
	facilityID: string;

	@MinLength(2)
	@MaxLength(50)
	@ApiProperty()
	name: string;

	@MinLength(6)
	@ApiProperty()
	description: string;

	@IsNumber()
	@ApiProperty({ example: 23, description: 'valid' })
	price: number;
}
