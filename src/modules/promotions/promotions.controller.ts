import { Controller, Get, NotFoundException } from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from './schemas/promotion.schema';
import { Public } from '../auth/decorators/public.decorator';

@Controller('promotions')
@ApiTags('promotions')
export class PromotionsController {
	@Public()
	@Get(':promotionID')
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiOperation({
		summary: 'Get promotion by id',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			_id: '123',
			targetID: '1234',
			type: PromotionType.FACILITY,
			name: 'facility promotion',
			description: 'string',
			value: 20000,
			method: PromotionMethod.NUMBER,
			minPriceApply: 120000,
			maxValue: 20000,
			startDate: new Date(),
			endDate: new Date(),
			customerType: CustomerType.MEMBER,
			status: PromotionStatus.ACTIVE,
		} as Promotion,
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Promotion not found!',
	})
	getPromotionById() {
		//
	}
}
