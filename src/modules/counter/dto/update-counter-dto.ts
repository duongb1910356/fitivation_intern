import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCounterDto {
	@IsNotEmpty()
	@IsNumber()
	count: number;
}
