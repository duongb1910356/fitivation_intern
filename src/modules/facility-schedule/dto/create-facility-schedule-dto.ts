import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ScheduleType } from '../entities/facility-schedule.entity';
import { OpenTimeDto } from './open-time-dto';
import { Type } from 'class-transformer';

export class CreateFacilityScheduleDto {
	@IsNotEmpty()
	@IsEnum(ScheduleType)
	type: ScheduleType;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => OpenTimeDto)
	OpenTime: OpenTimeDto[];
}
