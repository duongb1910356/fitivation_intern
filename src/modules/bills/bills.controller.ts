import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { Bill, BillStatus, PaymentMethod } from './schemas/bill.schema';
import {
	BillItem,
	BillItemStatus,
} from '../bill-items/schemas/bill-item.schema';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { TimeType } from '../package/entities/package.entity';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion.dto';
import { CreatePromotionDto } from '../promotions/dto/create-promotion.dto';

@Controller('bills')
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Get()
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getManyBills',
		description: 'Get many bills',
	})
	@ApiDocsPagination('bill')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: {},
						billItems: [
							{
								_id: '_id',
								facilityInfo: {
									facilityID: {},
									brandID: {},
									brandName: 'string',
									ownerFacilityName: 'string',
									facilityName: 'string',
									facilityAddress: {},
									facilityCoordinatesLocation: [1, 1],
									facilityPhoto: 'string',
								},
								packageTypeInfo: {
									packageTypeID: {},
									name: 'string',
									desctiption: 'string',
									price: 1,
								},
								packageInfo: {
									packageID: {},
									type: TimeType.ONE_MONTH,
									price: 1,
								},
								promotions: [
									{
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
									},
								] as Promotion[],
								promotionPrice: 1,
								totalPrice: 1,
								status: BillItemStatus.ACTIVE,
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						] as BillItem[],
						paymentMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0,
						description: 'string',
						promotions: [],
						promotionPrice: 0,
						totalPrice: 0,
						status: BillStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Bill[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Bill>,
			} as ListResponse<Bill>,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
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
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			},
		},
	})
	getManyBills(@Query() filter: ListOptions<Bill>) {
		return 'getManyBills';
	}

	@Get(':id')
	@ApiTags('bills')
	@ApiOperation({
		summary: 'getOneBill',
		description: 'Get one bill',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						accountID: {},
						billItems: [
							{
								_id: '_id',
								facilityInfo: {
									facilityID: {},
									brandID: {},
									brandName: 'string',
									ownerFacilityName: 'string',
									facilityName: 'string',
									facilityAddress: {},
									facilityCoordinatesLocation: [1, 1],
									facilityPhoto: 'string',
								},
								packageTypeInfo: {
									packageTypeID: {},
									name: 'string',
									desctiption: 'string',
									price: 1,
								},
								packageInfo: {
									packageID: {},
									type: TimeType.ONE_MONTH,
									price: 1,
								},
								promotions: [
									{
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
									},
								] as Promotion[],
								promotionPrice: 1,
								totalPrice: 1,
								status: BillItemStatus.ACTIVE,
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						] as BillItem[],
						paymentMethod: PaymentMethod.CREDIT_CARD,
						taxes: 0,
						description: 'string',
						promotions: [],
						promotionPrice: 0,
						totalPrice: 0,
						status: BillStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Bill[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Bill>,
			} as ListResponse<Bill>,
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
	getOneBill(@Param('id') id: string) {
		return 'getOneBill';
	}

	@Get('promotions')
	@ApiTags('bills/promotions')
	@ApiDocsPagination('promotion')
	@ApiOperation({
		summary: 'getManyBillPromotions',
		description: 'Allow user to get many bills promotions',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetID: 'string',
						type: PromotionType.BILL,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 0,
						maxQuantity: 0,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Promotion[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Promotion>,
			} as ListResponse<Promotion>,
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
	getManyBillPromotions(@Query() filter: ListOptions<Promotion>) {
		return 'getManyPromotions';
	}

	@Get('promotions/:id')
	@ApiTags('bills/promotions')
	@ApiOperation({
		summary: 'getOneBillPromotion',
		description: 'Allow user to get one bill promotion',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetID: 'string',
						type: PromotionType.BILL,
						name: 'string',
						description: 'string',
						couponCode: 'string',
						value: 1,
						method: PromotionMethod.NUMBER,
						minPriceApply: 0,
						maxQuantity: 0,
						startDate: new Date(),
						endDate: new Date(),
						customerType: CustomerType.CUSTOMER,
						status: PromotionStatus.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as Promotion[],
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Promotion>,
			} as ListResponse<Promotion>,
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
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	getOneBillPromotion(@Param('id') id: string) {
		return 'getOneBillPromotion';
	}

	@Post('promotions')
	@ApiTags('bills/promotions')
	@ApiOperation({
		summary: 'createBillPromotion',
		description: 'Allow admin to create one bill promotion',
	})
	@ApiBody({
		type: CreatePromotionDto,
		examples: {
			ADMIN: {
				value: {
					targetID: 'string',
					type: PromotionType.BILL,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 0,
					maxQuantity: 0,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				targetID: 'string',
				type: PromotionType.BILL,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 0,
				maxQuantity: 0,
				startDate: new Date(),
				endDate: new Date(),
				customerType: CustomerType.CUSTOMER,
				status: PromotionStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Promotion,
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
	createBillPromotion() {
		return 'createBillPromotion';
	}

	@Patch('promotions/:id')
	@ApiTags('bills/promotions')
	@ApiOperation({
		summary: 'updateBillPromotion',
		description: 'Allow admin to update one bill promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: UpdatePromotionDto,
		examples: {
			ADMIN: {
				value: {
					targetID: 'string',
					type: PromotionType.BILL,
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 0,
					maxQuantity: 0,
					startDate: new Date(),
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				targetID: 'string',
				type: PromotionType.BILL,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 0,
				maxQuantity: 0,
				startDate: new Date(),
				endDate: new Date(),
				customerType: CustomerType.CUSTOMER,
				status: PromotionStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Promotion,
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
	updateBillPromotion(
		@Param('id') id: string,
		@Body() updatePromotionDto: UpdatePromotionDto,
	) {
		return 'updateBillPromotion';
	}

	@Delete('promotions/:id')
	@ApiTags('bills/promotions')
	@ApiOperation({
		summary: 'deleteBillPromotion',
		description: 'Allow admin to delete one bill promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Deleted successfully',
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
	deleteBillPromotion(@Param('id') id: string) {
		return 'deleteBillPromotion';
	}
}
