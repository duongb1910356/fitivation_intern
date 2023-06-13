import { IsDateString, IsNotEmpty } from 'class-validator';

export class ShiftTimeDto {
	@IsNotEmpty()
	@IsDateString()
	startTime: Date;

	@IsNotEmpty()
	@IsDateString()
	endTime: Date;
}
