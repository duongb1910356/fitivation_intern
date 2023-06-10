import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from 'src/shared/response/common-response';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Controller('promotions')
@ApiTags('promotions')
export class PromotionsController {
	@Patch(':id')
	@ApiBody({
		type: UpdatePromotionDto,
		schema: {
			examples: {
				Bill_Promotion: {
					value: {},
				},
				Facility_Promotion: {
					value: {},
				},
				Package_Promotion: {
					value: {},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			example: {
				Bill_Promotion: {
					value: {},
				},
				Facility_Promotion: {
					value: {},
				},
				Package_Promotion: {
					value: {},
				},
			},
		},
	})
	updatePrmotion(
		@Param('id') id: string,
		@Body() updatePromotionDto: UpdatePromotionDto,
	) {
		return 'updatePrmotion';
	}

	@Delete(':id')
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deletePromotion(@Param('id') id: string) {
		return 'deletePrmotion';
	}
}
