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
import {
	CustomerType,
	PromotionMethod,
	PromotionStatus,
} from '../schemas/promotion.schema';

export class CreatePromotionDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(12)
	targetID: string;

	@IsNumber()
	@Min(0)
	type: number;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(40)
	name: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(120)
	description: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(10)
	@IsOptional()
	couponCode?: string;

	@IsNumber()
	@Min(0)
	value: number;
	method: PromotionMethod;

	@IsNumber()
	@Min(0)
	minPriceApply: number;

	@IsNumber()
	@Min(0)
	maxValue: number;

	@IsNumber()
	@Min(0)
	@IsOptional()
	maxQuantity?: number;

	@IsDate()
	startDate: Date;

	@IsDate()
	endDate: Date;

	@IsEnum(CustomerType)
	customerType: CustomerType;

	@IsEnum(PromotionStatus)
	@IsOptional()
	status?: PromotionStatus;
}
