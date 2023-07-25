import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion-dto';
import {
	IsDate,
	IsEnum,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';
import {
	CustomerType,
	PromotionMethod,
	PromotionStatus,
} from '../schemas/promotion.schema';
import { Type } from 'class-transformer';

export class UpdatePromotionDto {
	@IsOptional()
	@IsString()
	@IsMongoId()
	targetID?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(40)
	name?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(120)
	description?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(10)
	couponCode?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	value?: number;

	@IsOptional()
	@IsEnum(PromotionMethod)
	method?: PromotionMethod;

	@IsOptional()
	@IsNumber()
	@Min(0)
	minPriceApply?: number; // áp dụng cho đơn có giá trừ ${minPriceApply} đồng

	@IsOptional()
	@IsNumber()
	@Min(0)
	maxValue?: number; // mức giảm tối đa có thể

	@IsOptional()
	@IsNumber()
	@Min(0)
	maxQuantity?: number;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	startDate?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	endDate?: Date;

	@IsOptional()
	@IsEnum(CustomerType)
	customerType?: CustomerType;

	@IsOptional()
	@IsEnum(PromotionStatus)
	status?: PromotionStatus;
}
