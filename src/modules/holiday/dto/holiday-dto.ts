import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class HolidayDto {
	@IsNotEmpty()
	@IsDateString()
	startDate: Date;

	@IsNotEmpty()
	@IsDateString()
	endDate: Date;

	@IsOptional()
	@IsString()
	content?: string;
}
