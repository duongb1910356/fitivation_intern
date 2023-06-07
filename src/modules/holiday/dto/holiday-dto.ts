import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HolidayDto {
	@IsNotEmpty()
	@IsDate()
	startDate: Date;

	@IsNotEmpty()
	@IsDate()
	endDate: Date;

	@IsOptional()
	@IsString()
	content?: string;
}
