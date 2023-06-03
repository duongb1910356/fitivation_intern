import { IsDate, IsNotEmpty } from 'class-validator';

export class ShiftTimeDto {
	@IsNotEmpty()
	@IsDate()
	startTime: Date;

	@IsNotEmpty()
	@IsDate()
	endTime: Date;
}
