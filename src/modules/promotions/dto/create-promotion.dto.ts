import {
	IsNotEmpty,
	IsString,
	IsNumber,
	IsEnum,
	IsOptional,
	MinLength,
	MaxLength,
	Min,
	IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
	CustomerType,
	PromotionMethod,
	PromotionStatus,
} from '../schemas/promotion.schema';

export class CreatePromotionDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(12)
	targetID: string;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	type: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(40)
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(120)
	description: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(10)
	@IsOptional()
	couponCode?: string;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	value: number;
	method: PromotionMethod;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	minPriceApply: number;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	maxValue: number;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	@IsOptional()
	maxQuantity?: number;

	@ApiProperty()
	@IsDate()
	startDate: Date;

	@ApiProperty()
	@IsDate()
	endDate: Date;

	@ApiProperty()
	@IsEnum(CustomerType)
	customerType: CustomerType;

	@ApiProperty()
	@IsEnum(PromotionStatus)
	status: PromotionStatus;
}
