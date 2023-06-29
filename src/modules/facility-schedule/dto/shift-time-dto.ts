import { IsNotEmpty } from 'class-validator';
import { ShiftTimeTransform } from './shift-time-transform';

export class ShiftTimeDto {
	@IsNotEmpty()
	@ShiftTimeTransform()
	startTime: string;

	@IsNotEmpty()
	endTime: string;
}
