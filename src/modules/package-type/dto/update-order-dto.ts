import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateOrderDto {
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	order1: number;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	order2: number;
}
