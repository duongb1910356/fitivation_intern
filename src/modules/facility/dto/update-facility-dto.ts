import { PartialType, PickType } from '@nestjs/swagger';
import { CreateFacilityDto } from './create-facility-dto';

export class UpdateFacilityDto extends PartialType(
	PickType(CreateFacilityDto, [
		'brandID',
		'facilityCategoryID',
		'name',
		'address',
		'summary',
		'description',
		'coordinatesLocation',
		'photos',
		'scheduleType',
		'state',
	]),
) {}
