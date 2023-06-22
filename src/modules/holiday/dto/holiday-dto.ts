import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinDate,
} from 'class-validator';
import { IsStartDateBeforeEndDate } from './holiday-validator';
import { Transform } from 'class-transformer';

export class HolidayDto {
	@IsNotEmpty()
	@IsDate()
	@Transform(({ value }) => new Date(value))
	@MinDate(new Date())
	@IsStartDateBeforeEndDate()
	startDate: Date;

	@IsNotEmpty()
	@IsDate()
	@MinDate(new Date())
	@Transform(({ value }) => new Date(value))
	endDate: Date;

	@IsOptional()
	@IsString()
	content?: string;
}
