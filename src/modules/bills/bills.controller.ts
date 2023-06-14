import { Controller, Get, Param, Post, Query } from '@nestjs/common';
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
import { CreatePromotionDto } from '../promotions/dto/create-promotion-dto';
import { BillItemPackage } from '../bill-items/schemas/bill-item-package.schema';
import { BillItemPackageType } from '../bill-items/schemas/bill-item-package-type.schema';
import { BillItemFacility } from '../bill-items/schemas/bill-item-facility.schema';

@Controller('bills')
@ApiTags('bills')
export class BillsController {
	constructor(private readonly billsService: BillsService) {}

	@Get()
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
								brandID: {},
								facilityID: {},
								packageTypeID: {},
								packageID: {},
								facilityInfo: {
									brandName: 'string',
									ownerFacilityName: 'string',
									facilityName: 'string',
									facilityAddress: {},
									facilityCoordinatesLocation: [1, 1],
									facilityPhoto: 'string',
								} as BillItemFacility,
								packageTypeInfo: {
									name: 'string',
									description: 'string',
									price: 1,
								} as BillItemPackageType,
								packageInfo: {
									type: TimeType.ONE_MONTH,
									price: 1,
								} as BillItemPackage,
								promotions: [
									{
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
							{
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
							},
						],
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
								brandID: {},
								facilityID: {},
								packageTypeID: {},
								packageID: {},
								facilityInfo: {
									brandName: 'string',
									ownerFacilityName: 'string',
									facilityName: 'string',
									facilityAddress: {},
									facilityCoordinatesLocation: [1, 1],
									facilityPhoto: 'string',
								} as BillItemFacility,
								packageTypeInfo: {
									name: 'string',
									description: 'string',
									price: 1,
								} as BillItemPackageType,
								packageInfo: {
									type: TimeType.ONE_MONTH,
									price: 1,
								} as BillItemPackage,
								promotions: [
									{
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
							{
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
							},
						],
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
	@ApiOperation({
		summary: 'getOneBillPromotion',
		description: 'Allow user to get one bill promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
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
	getOneBillPromotion(@Param('id') id: string) {
		return 'getOneBillPromotion';
	}

	@Post('promotions')
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
}
