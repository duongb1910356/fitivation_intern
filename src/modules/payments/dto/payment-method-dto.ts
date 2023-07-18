import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentMethodDto {
	@IsString()
	@IsNotEmpty()
	paymentMethod: string;
}
