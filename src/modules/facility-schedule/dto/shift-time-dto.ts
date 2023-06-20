import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { IsStartTimeBeforeEndTime } from '../validators/shift-time-validator';

export class ShiftTimeDto {
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	@IsStartTimeBeforeEndTime()
	startTime: Date;

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	endTime: Date;
}
