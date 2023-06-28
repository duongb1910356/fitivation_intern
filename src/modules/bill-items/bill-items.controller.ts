import { Controller, Get, Param, Query } from '@nestjs/common';
import { BillItemsService } from './bill-items.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillItem, BillItemStatus } from './schemas/bill-item.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { TimeType } from '../package/entities/package.entity';
import { BillItemFacility } from './schemas/bill-item-facility.schema';
import { BillItemPackageType } from './schemas/bill-item-package-type.schema';
import { BillItemPackage } from './schemas/bill-item-package.schema';

@Controller('bill-items')
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}

	@Get()
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'getManyBillItems',
		description:
			'Allow customer to get many of their bill-items\n\nAllow admin to get many bill-items',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						brandID: 'string',
						facilityID: 'string',
						packageTypeID: 'string',
						packageID: 'string',
						facilityInfo: {
							brandName: 'string',
							ownerFacilityName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: [1, 1],
							facilityPhotos: [],
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
								targetID: 'string',
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
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getManyBillItems(@Query() filter: ListOptions<BillItem>) {
		return 'getManyBillItems';
	}

	@Get(':id')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'getOneBillItem',
		description:
			'Allow customer to get one of their bill-items\n\nAllow admin to get one of bill-item',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '_id',
						brandID: 'string',
						facilityID: 'string',
						packageTypeID: 'string',
						packageID: 'string',
						facilityInfo: {
							brandName: 'string',
							ownerFacilityName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: [1, 1],
							facilityPhotos: [],
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
								targetID: 'string',
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
				total: 1,
				options: {
					limit: 1,
					offset: 0,
					searchField: {},
					searchValue: '',
					sortField: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<BillItem>,
			} as ListResponse<BillItem>,
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
	getOneBillItems(@Param('id') id: string) {
		return 'getOneBillItems';
	}
}
