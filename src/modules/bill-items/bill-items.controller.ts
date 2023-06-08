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

@Controller()
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}

	@Get('bill-items')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'getManyBillItems',
		description: 'Get many bill-items',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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

	@Get('bill-items/:id')
	@ApiTags('bill-items')
	@ApiOperation({
		summary: 'getOneBillItem',
		description: 'Get one bill-item',
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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

	@Get('facilities/bill-items')
	@ApiTags('facilities/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsAllOwnFacility',
		description:
			'Allow facility owners to get many bill-items for all owned facilities',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getManyBillItemsAllOwnFacility(@Query() filter: ListOptions<BillItem>) {
		return 'getManyBillItemsAllOwnFacility';
	}

	@Get('facilities/:facilityID/bill-items')
	@ApiParam({ name: 'facilityID', type: String, description: 'facility ID' })
	@ApiTags('facilities/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsOneOwnFacility',
		description:
			'Allow facility owners to get many bill-items for one owned facility\n\nAllow admin to get many bill-items for one facility',
	})
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getManyBillItemsOneOwnFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		return 'getManyBillItemsOneOwnFacility';
	}

	@Get('facilities/:facilityID/bill-items/:billItemID')
	@ApiTags('facilities/bill-items')
	@ApiOperation({
		summary: 'getOneBillItemOneOwnFacility',
		description:
			'Allow facility owners to get one bill-item for one owned facility\n\nAllow admin to get one bill-item for one facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getOneBillItemOneOwnFacility(
		@Param('facilityID') facilityID: string,
		@Param('billItemID') billItemID: string,
	) {
		return 'getOneBillItemOneOwnFacility';
	}

	@Get('package/:packageID/bill-items')
	@ApiTags('packages/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsOneOwnPackage',
		description:
			'Allow facility owners to get many bill-items for one owned package\n\nAllow admin to get many bill-items for one package',
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getManyBillItemsOneOwnPackage(
		@Param('packageID') packageID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		return 'getManyBillItemsOneOwnPackage';
	}

	@Get('package/:packageID/bill-items/:billItemID')
	@ApiTags('packages/bill-items')
	@ApiOperation({
		summary: 'getOneBillItemOneOwnPackage',
		description:
			'Allow facility owners to get one bill-item for one owned package\n\nAllow admin to get one bill-item for one package',
	})
	@ApiParam({ name: 'packageID', type: String, description: 'Package ID' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getOneBillItemOneOwnPackage(
		@Param('packageID') packageID: string,
		@Param('billItemID') billItemID: string,
	) {
		return 'getOneBillItemOneOwnPackage';
	}

	@Get('brands/:brandID/bill-items')
	@ApiTags('brands/bill-items')
	@ApiOperation({
		summary: 'getManyBillItemsOneOwnBrand',
		description:
			'Allow facility owners to get many billItems for one owned brand\n\nAllow admin to get many bill-items for one brand',
	})
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
	@ApiDocsPagination('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getManyBillItemsOneOwnBrand(
		@Param('brandID') brandID: string,
		@Query() filter: ListOptions<BillItem>,
	) {
		return 'getManyBillItemsOneOwnBrand';
	}

	@Get('brands/:brandID/bill-items/:billItemID')
	@ApiTags('brands/bill-items')
	@ApiOperation({
		summary: 'getOneBillItemOneOwnBrand',
		description:
			'Allow facility owners to get one bill-items for one owned brand\n\nAllow admin to get one bill-item for one brand',
	})
	@ApiParam({ name: 'brandID', type: String, description: 'Brand ID' })
	@ApiParam({ name: 'billItemID', type: String, description: 'Bill-item ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
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
	getOneBillItemOneOwnBrand(
		@Param('brandID') brandID: string,
		@Param('billItemID') billItemID: string,
	) {
		return 'getOneBillItemOneOwnBrand';
	}
}
