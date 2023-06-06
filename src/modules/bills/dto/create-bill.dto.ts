import {
	IsNotEmpty,
	IsString,
	IsNumber,
	IsEnum,
	IsArray,
	IsOptional,
	ArrayNotEmpty,
	ArrayMinSize,
	IsPositive,
	MinLength,
	MaxLength,
	Min,
} from 'class-validator';
import { BillStatus, PaymentMethod } from '../schemas/bill.schema';

export class CreateBillDto {
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@IsArray()
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	billItems: object[];

	@IsEnum(PaymentMethod)
	@IsNotEmpty()
	paymentMethod: PaymentMethod;

	@IsNumber()
	@Min(0)
	taxes: number;

	@IsString()
	@IsOptional()
	@MinLength(2)
	@MaxLength(200)
	description?: string;

	@IsArray()
	@IsOptional()
	promotions?: object[];

	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	promotionsPrice: number;

	@IsNumber()
	@IsNotEmpty()
	@IsPositive()
	totalPrice: number;

	@IsEnum(BillStatus)
	@IsOptional()
	status?: BillStatus;
}
