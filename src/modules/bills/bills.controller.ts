import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiParam,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { Bill, BillStatus } from './schemas/bill.schema';
import {
	BillItem,
	BillItemStatus,
} from '../bill-items/schemas/bill-item.schema';
import { ErrorResponse } from 'src/shared/response/common-response';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { TimeType } from '../package/entities/package.entity';
import { BillItemPackage } from '../bill-items/schemas/bill-item-package.schema';
import { BillItemPackageType } from '../bill-items/schemas/bill-item-package-type.schema';
import { BillItemFacility } from '../bill-items/schemas/bill-item-facility.schema';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { ListResponseV2, QueryObject } from 'src/shared/utils/query-api';
import { TokenPayload } from '../auth/types/token-payload.type';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { BillItemsService } from '../bill-items/bill-items.service';
import { ApiDocsPaginationVer2 } from 'src/decorators/swagger-form-data.decorator-v2';

@Controller('bills')
@ApiTags('bills')
@ApiBearerAuth()
export class BillsController {
	constructor(
		private readonly billService: BillsService,
		private readonly billItemsService: BillItemsService,
	) {}

	@ApiOperation({
		summary: 'Find Many Bills',
		description: `Find many bills.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.MEMBER}.`,
	})
	@ApiDocsPaginationVer2('bill')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					items: [
						{
							_id: '_id',
							accountID: 'string',
							billItems: [
								{
									_id: '_id',
									brandID: 'string',
									facilityID: 'string',
									packageTypeID: 'string',
									packageID: 'string',
									ownerFacilityID: 'string',
									accountID: 'string',
									facilityInfo: {
										brandName: 'string',
										facilityAddress: {},
										facilityCoordinatesLocation: {
											coordinates: [10.027851057940572, 105.77291088739058],
										},
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
							paymentMethod: 'string',
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
					queryOptions: {
						sort: 'string',
						fields: 'string',
						limit: 10,
						page: 0,
					} as QueryObject,
				} as ListResponseV2<Bill>,
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
	@Get()
	@Roles(UserRole.ADMIN, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async findManyBills(
		@GetCurrentUser() user: TokenPayload,
		@Query() query: QueryObject,
	): Promise<ListResponseV2<Bill>> {
		return await this.billService.findMany(query, user);
	}

	@ApiOperation({
		summary: 'Find One Bill',
		description: `Find one bill.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.MEMBER}.`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Bill ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					_id: '_id',
					accountID: 'string',
					billItems: [
						{
							_id: '_id',
							brandID: 'string',
							facilityID: 'string',
							packageTypeID: 'string',
							packageID: 'string',
							ownerFacilityID: 'string',
							accountID: 'string',
							facilityInfo: {
								brandName: 'string',
								facilityAddress: {},
								facilityCoordinatesLocation: {
									coordinates: [10.027851057940572, 105.77291088739058],
								},
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
					paymentMethod: 'string',
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
				} as Bill,
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
	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async findOneBill(
		@Param('id') billID: string,
		@GetCurrentUser() user: TokenPayload,
	): Promise<Bill> {
		return await this.billService.findOneByID(billID, user);
	}

	@ApiOperation({
		summary: 'Find One Bill Item',
		description: `Allow customer to get one of their bill-items\n\nAllow admin to get one of bill-item\n\nAllow facility owner to get one of bill-item.\n\nRoles: ${UserRole.ADMIN}, ${UserRole.FACILITY_OWNER}, ${UserRole.MEMBER}`,
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
						ownerFacilityID: 'string',
						accountID: 'string',
						facilityInfo: {
							brandName: 'string',
							facilityName: 'string',
							facilityAddress: {},
							facilityCoordinatesLocation: {
								coordinates: [10.027851057940572, 105.77291088739058],
							},
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
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
			} as ListResponseV2<BillItem>,
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
	@Get('bill-items/:id')
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	async findOneBillItem(
		@Param('id') id: string,
		@GetCurrentUser() user: TokenPayload,
	): Promise<BillItem> {
		return await this.billItemsService.findOneByID(id, user);
	}

	// 	@ApiDocsPagination('promotion')
	// 	@ApiOperation({
	// 		summary: 'findManyBillPromotions',
	// 		description: 'Allow user to get many bills promotions',
	// 	})
	// 	@ApiResponse({
	// 		status: 200,
	// 		schema: {
	// 			example: {
	// 				items: [
	// 					{
	// 						targetID: 'string',
	// 						type: PromotionType.BILL,
	// 						name: 'string',
	// 						description: 'string',
	// 						couponCode: 'string',
	// 						value: 1,
	// 						method: PromotionMethod.NUMBER,
	// 						minPriceApply: 0,
	// 						maxQuantity: 0,
	// 						startDate: new Date(),
	// 						endDate: new Date(),
	// 						customerType: CustomerType.CUSTOMER,
	// 						status: PromotionStatus.ACTIVE,
	// 						createdAt: new Date(),
	// 						updatedAt: new Date(),
	// 					},
	// 				] as Promotion[],
	// 				total: 1,
	// 				queryOptions: {
	// 					sort: 'string',
	// 					fields: 'string',
	// 					limit: 10,
	// 					page: 0,
	// 				} as QueryObject,
	// 			} as ListResponse<Promotion>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 400,
	// 		schema: {
	// 			example: {
	// 				code: '400',
	// 				message: 'Bad request',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 401,
	// 		schema: {
	// 			example: {
	// 				code: '401',
	// 				message: 'Unauthorized',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 403,
	// 		schema: {
	// 			example: {
	// 				code: '403',
	// 				message: `Forbidden resource`,
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@Get('promotions')
	// 	findManyBillPromotions(@Query() filter: ListOptions<Promotion>) {
	// 		return 'findManyPromotions';
	// 	}

	// 	@ApiOperation({
	// 		summary: 'findOneBillPromotion',
	// 		description: 'Allow user to get one bill promotion',
	// 	})
	// 	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	// 	@ApiResponse({
	// 		status: 200,
	// 		schema: {
	// 			example: {
	// 				items: [
	// 					{
	// 						targetID: 'string',
	// 						type: PromotionType.BILL,
	// 						name: 'string',
	// 						description: 'string',
	// 						couponCode: 'string',
	// 						value: 1,
	// 						method: PromotionMethod.NUMBER,
	// 						minPriceApply: 0,
	// 						maxQuantity: 0,
	// 						startDate: new Date(),
	// 						endDate: new Date(),
	// 						customerType: CustomerType.CUSTOMER,
	// 						status: PromotionStatus.ACTIVE,
	// 						createdAt: new Date(),
	// 						updatedAt: new Date(),
	// 					},
	// 				] as Promotion[],
	// 				total: 1,
	// 				queryOptions: {
	// 					sort: 'string',
	// 					fields: 'string',
	// 					limit: 10,
	// 					page: 0,
	// 				} as QueryObject,
	// 			} as ListResponse<Promotion>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 400,
	// 		schema: {
	// 			example: {
	// 				code: '400',
	// 				message: 'Bad request',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 401,
	// 		schema: {
	// 			example: {
	// 				code: '401',
	// 				message: 'Unauthorized',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 403,
	// 		schema: {
	// 			example: {
	// 				code: '403',
	// 				message: `Forbidden resource`,
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 404,
	// 		schema: {
	// 			example: {
	// 				code: '404',
	// 				message: 'Not found document with that ID',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@Get('promotions/:id')
	// 	findOneBillPromotion(@Param('id') id: string) {
	// 		return 'getOneBillPromotion';
	// 	}

	// 	@Post('/promotions')
	// 	@ApiOperation({
	// 		summary: 'createBillPromotion',
	// 		description: 'Allow admin to create one bill promotion',
	// 	})
	// 	@ApiBody({
	// 		type: CreatePromotionDto,
	// 		examples: {
	// 			ADMIN: {
	// 				value: {
	// 					targetID: 'string',
	// 					type: PromotionType.BILL,
	// 					name: 'string',
	// 					description: 'string',
	// 					couponCode: 'string',
	// 					value: 1,
	// 					method: PromotionMethod.NUMBER,
	// 					minPriceApply: 0,
	// 					maxQuantity: 0,
	// 					startDate: new Date(),
	// 					endDate: new Date(),
	// 					customerType: CustomerType.CUSTOMER,
	// 				},
	// 			},
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 201,
	// 		schema: {
	// 			example: {
	// 				targetID: 'string',
	// 				type: PromotionType.BILL,
	// 				name: 'string',
	// 				description: 'string',
	// 				couponCode: 'string',
	// 				value: 1,
	// 				method: PromotionMethod.NUMBER,
	// 				minPriceApply: 0,
	// 				maxQuantity: 0,
	// 				startDate: new Date(),
	// 				endDate: new Date(),
	// 				customerType: CustomerType.CUSTOMER,
	// 				status: PromotionStatus.ACTIVE,
	// 				createdAt: new Date(),
	// 				updatedAt: new Date(),
	// 			} as Promotion,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 400,
	// 		schema: {
	// 			example: {
	// 				code: '400',
	// 				message: 'Bad request',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 401,
	// 		schema: {
	// 			example: {
	// 				code: '401',
	// 				message: 'Unauthorized',
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	@ApiResponse({
	// 		status: 403,
	// 		schema: {
	// 			example: {
	// 				code: '403',
	// 				message: `Forbidden resource`,
	// 				details: null,
	// 			} as ErrorResponse<null>,
	// 		},
	// 	})
	// 	createBillPromotion() {
	// 		return 'createBillPromotion';
	// 	}
}
