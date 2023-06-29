import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePromotionDto } from './create-promotion-dto';

export class UpdatePromotionDto extends PartialType(
	PickType(CreatePromotionDto, [
		'name',
		'description',
		'couponCode',
		'value',
		'method',
		'minPriceApply',
		'maxValue',
		'maxQuantity',
		'endDate',
		'customerType',
		'status',
	]),
) {}
