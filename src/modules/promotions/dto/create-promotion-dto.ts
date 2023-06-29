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
import { Type } from 'class-transformer';

export class CreatePromotionDto {
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

	@IsEnum(PromotionMethod)
	@IsNotEmpty()
	method: PromotionMethod;

	@IsNumber()
	@Min(0)
	minPriceApply: number; // áp dụng cho đơn có giá trừ ${minPriceApply} đồng

	@IsNumber()
	@Min(0)
	maxValue: number; // mức giảm tối đa có thể

	@IsNumber()
	@Min(0)
	@IsOptional()
	maxQuantity?: number;

	@IsDate()
	@Type(() => Date)
	startDate: Date;

	@IsDate()
	@Type(() => Date)
	endDate: Date;

	@IsEnum(CustomerType)
	customerType: CustomerType;

	@IsEnum(PromotionStatus)
	@IsOptional()
	status?: PromotionStatus;
}
