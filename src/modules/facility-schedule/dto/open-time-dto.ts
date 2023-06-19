import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';
import { dayOfWeek } from '../entities/open-time.entity';
import { ShiftTimeDto } from './shift-time-dto';
import { Type } from 'class-transformer';

export class OpenTimeDto {
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ShiftTimeDto)
	shift: ShiftTimeDto[];

	@IsOptional()
	@IsEnum(dayOfWeek)
	dayOfWeek?: dayOfWeek;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(31)
	dayOfMonth?: number;
}
