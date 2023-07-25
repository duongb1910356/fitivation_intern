import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinDate,
} from 'class-validator';
import { IsStartDateBeforeEndDate } from './holiday-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class HolidayDto {
	@IsNotEmpty()
	@IsDate()
	@Transform(({ value }: TransformFnParams) => {
		const date = new Date(value);
		date.setMinutes(0, 0, 0);
		return date;
	})
	@MinDate(new Date())
	@IsStartDateBeforeEndDate()
	startDate: Date;

	@IsNotEmpty()
	@IsDate()
	@MinDate(new Date())
	@Transform(({ value }: TransformFnParams) => {
		const date = new Date(value);
		date.setMinutes(0, 0, 0);
		return date;
	})
	endDate: Date;

	@IsOptional()
	@IsString()
	content?: string;
}
