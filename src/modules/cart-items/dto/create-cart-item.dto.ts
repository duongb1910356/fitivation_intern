import {
	IsNotEmpty,
	IsString,
	IsNumber,
	IsArray,
	IsOptional,
	Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	cartID: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageID: string;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	promotionIDs: string[];

	@ApiProperty()
	@IsNumber()
	@Min(0)
	promotionPrice: number;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	totalPrice: number;
}
