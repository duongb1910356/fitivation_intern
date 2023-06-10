import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/shared/response/common-response';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from './schemas/promotion.schema';

@Controller('promotions')
@ApiTags('promotions')
export class PromotionsController {
	@Patch(':id')
	@ApiOperation({
		summary: 'updatePromotion',
		description:
			'Allow admin to update bill promotion\n\nAllow facility owner to update facility promotion or package promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: UpdatePromotionDto,
		examples: {
			Bill_Promotion: {
				value: {
					targetID: {},
					type: PromotionType.BILL,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 1,
					maxValue: 1,
					maxQuantity: 1,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
					status: PromotionStatus.ACTIVE,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
			Facility_Promotion: {
				value: {
					targetID: {},
					type: PromotionType.FACILITY,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 1,
					maxValue: 1,
					maxQuantity: 1,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
					status: PromotionStatus.ACTIVE,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
			Package_Promotion: {
				value: {
					targetID: {},
					type: PromotionType.PACKAGE,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 1,
					maxValue: 1,
					maxQuantity: 1,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
					status: PromotionStatus.ACTIVE,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				Bill_Promotion: {
					value: {
						targetID: {},
						type: PromotionType.BILL,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 1,
						maxValue: 1,
						maxQuantity: 1,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Promotion,
				},
				Facility_Promotion: {
					value: {
						targetID: {},
						type: PromotionType.BILL,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 1,
						maxValue: 1,
						maxQuantity: 1,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Promotion,
				},
				Package_Promotion: {
					value: {
						targetID: {},
						type: PromotionType.BILL,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 1,
						maxValue: 1,
						maxQuantity: 1,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Promotion,
				},
			},
		},
	})
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
	updatePromotion(
		@Param('id') id: string,
		@Body() updatePromotionDto: UpdatePromotionDto,
	) {
		return 'updatePromotion';
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'deletePromotion',
		description:
			'Allow admin to delete bill promotion\n\nAllow facility owner to delete facility promotion or package promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'Deleted successfully',
				details: null,
			},
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
		return 'deletePromotion';
	}
}
