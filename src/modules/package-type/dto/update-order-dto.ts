import { IsNumber, Min } from 'class-validator';

export class UpdateOrderDto {
	@IsNumber()
	@Min(0)
	order1: number;

	@IsNumber()
	@Min(0)
	order2: number;
}
