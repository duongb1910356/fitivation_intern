import { PaymentMethod } from '../schemas/bill.schema';
import {
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePromotionDto } from 'src/modules/promotions/dto/create-promotion-dto';
import { CreateBillItemDto } from 'src/modules/bill-items/dto/create-bill-item-dto';

export class CreateBillDto {
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateBillItemDto)
	billItems: CreateBillItemDto[];

	@IsEnum(PaymentMethod)
	paymentMethod: PaymentMethod;
	taxes: number;

	@IsString()
	@IsOptional()
	description?: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePromotionDto)
	promotions?: CreatePromotionDto[];

	@IsNumber()
	@Min(0)
	promotionPrice: number;

	@IsNumber()
	@Min(0)
	totalPrice: number;
}
