import { PartialType, PickType } from '@nestjs/swagger';
import { CreateFacilityDto } from './create-facility-dto';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';

export class UpdateFacilityDto extends PartialType(
	PickType(CreateFacilityDto, [
		'brandID',
		'facilityCategoryID',
		'name',
		'address',
		'summary',
		'description',
		'coordinates',
		'photos',
		'scheduleType',
		'state',
	]),
) {
	'reviews': Review;
}
