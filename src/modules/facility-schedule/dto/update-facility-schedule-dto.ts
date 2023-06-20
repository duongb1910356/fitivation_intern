import { PartialType, PickType } from '@nestjs/swagger';
import { CreateFacilityScheduleDto } from './create-facility-schedule-dto';

export class UpdateFacilityScheduleDto extends PartialType(
	PickType(CreateFacilityScheduleDto, ['openTime']),
) {}
