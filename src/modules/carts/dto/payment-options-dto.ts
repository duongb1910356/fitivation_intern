import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';
import { PaymentMethod } from 'src/modules/bills/schemas/bill.schema';

export class PaymentOptDto {
	@IsEnum(PaymentMethod)
	@IsOptional()
	paymentMethod?: PaymentMethod;

	@IsOptional()
	@IsNumber()
	@Min(0)
	taxes?: number;

	@IsOptional()
	@IsString()
	@MinLength(0)
	@MaxLength(200)
	description?: string;
}
