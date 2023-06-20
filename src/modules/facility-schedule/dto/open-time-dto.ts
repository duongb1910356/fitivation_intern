import {
	ArrayNotEmpty,
	IsEnum,
	IsNumber,
	IsOptional,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';
import { dayOfWeek } from '../entities/open-time.entity';
import { ShiftTimeDto } from './shift-time-dto';
import { Type } from 'class-transformer';
import { ValidateShiftsOverlap } from '../validators/open-time-validator';

export class OpenTimeDto {
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ShiftTimeDto)
	@ValidateShiftsOverlap()
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
