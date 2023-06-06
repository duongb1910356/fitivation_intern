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
import { ApiProperty } from '@nestjs/swagger';
import { BillStatus, PaymentMethod } from '../schemas/bill.schema';

export class CreateBillDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@ApiProperty()
	@IsArray()
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	billItems: object[];

	@ApiProperty()
	@IsEnum(PaymentMethod)
	@IsNotEmpty()
	paymentMethod: PaymentMethod;

	@ApiProperty()
	@IsNumber()
	@Min(0)
	taxes: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	@MinLength(2)
	@MaxLength(200)
	description?: string;

	@ApiProperty()
	@IsArray()
	@IsOptional()
	promotions?: object[];

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	promotionsPrice: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@IsPositive()
	totalPrice: number;

	@ApiProperty()
	@IsEnum(BillStatus)
	@IsOptional()
	status?: BillStatus;
}
