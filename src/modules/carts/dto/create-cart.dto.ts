import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateCartDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	promotionsIDs?: object[];

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	@Min(0)
	promotionPrice?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	totalPrice?: number;
}
