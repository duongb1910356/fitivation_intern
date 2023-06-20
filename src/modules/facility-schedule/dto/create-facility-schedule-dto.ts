import {
	ArrayNotEmpty,
	IsEnum,
	IsNotEmpty,
	ValidateNested,
} from 'class-validator';
import { ScheduleType } from '../entities/facility-schedule.entity';
import { OpenTimeDto } from './open-time-dto';
import { Type } from 'class-transformer';
import { ValidateScheduleType } from '../validators/facility-schedule-validator';

export class CreateFacilityScheduleDto {
	@IsNotEmpty()
	@IsEnum(ScheduleType)
	type: ScheduleType;

	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OpenTimeDto)
	@ValidateScheduleType()
	openTime: OpenTimeDto[];
}
