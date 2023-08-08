import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from '@nestjs/common';
import { BillItemsService } from './bill-items.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { ErrorResponse } from 'src/shared/response/common-response';
import { ListResponseV2, QueryObject } from 'src/shared/utils/query-api';
import { BillItem, BillItemStatus } from './schemas/bill-item.schema';
import { BillItemFacility } from './schemas/bill-item-facility.schema';
import { BillItemPackageType } from './schemas/bill-item-package-type.schema';
import { TimeType } from '../package/entities/package.entity';
import { BillItemPackage } from './schemas/bill-item-package.schema';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { ApiDocsPaginationVer2 } from 'src/decorators/swagger-form-data.decorator-v2';

@Controller('bill-items')
@ApiTags('bill-items')
@ApiBearerAuth()
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}

	@ApiOperation({
		summary: 'Get Quantity Customer Of Own Facilities',
		description: `Get quantity customer of own facilities.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberCustomers: 1,
				},
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
	@Get('statics/quantity-customers')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getQuantityCustomerOfOwnFacilities(
		@GetCurrentUser('sub') userID: string,
	): Promise<object> {
		return await this.billItemsService.getQuantityCustomerOfOwnFacilities(
			userID,
		);
	}

	@ApiOperation({
		summary: 'Get Quantity bill-item Of Own Facilities Statistic',
		description: `Get quantity bill-item of own facilities.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberbillItems: 1,
				},
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
	@Get('statics/quantity-facilities')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getQuantityBillItemOwnFacilitiesStats(
		@GetCurrentUser('sub') userID: string,
	): Promise<object> {
		return await this.billItemsService.getQuantityBillItemOwnFacilitiesStats(
			userID,
		);
	}

	@ApiOperation({
		summary: 'Get Yearly Bill-items of Own Facilities Statistic',
		description: `Get yearly bills-item of own facilities statistic.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: [
					{
						numberBillItems: 7,
						totalPrice: 3940000,
						avgTotalPrice: 562857.1428571428,
						minPrice: 140000,
						maxPrice: 1830000,
						year: 2023,
					},
					{
						numberBillItems: 1,
						totalPrice: 1680000,
						avgTotalPrice: 1680000,
						minPrice: 1680000,
						maxPrice: 1680000,
						year: 2022,
					},
					{
						numberBillItems: 1,
						totalPrice: 300000,
						avgTotalPrice: 300000,
						minPrice: 300000,
						maxPrice: 300000,
						year: 2021,
					},
				],
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
	@Get('statics/yearly')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getYearlyBillItemOwnFacilitiesStats(
		@GetCurrentUser('sub') userID: string,
	): Promise<Array<object>> {
		return await this.billItemsService.getYearlyBillItemOwnFacilitiesStats(
			userID,
		);
	}

	@ApiOperation({
		summary: 'Get Monthly Bill-items Of Own Facilities Statistic',
		description: `Get monthly bill-items of own facilities statistic.\n\nRoles: ${UserRole.FACILITY_OWNER}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: [
					{
						numberBillItems: 3,
						totalPrice: 2820000,
						avgTotalPrice: 940000,
						minPrice: 150000,
						maxPrice: 1830000,
						month: 3,
					},
					{
						numberBillItems: 1,
						totalPrice: 420000,
						avgTotalPrice: 420000,
						minPrice: 420000,
						maxPrice: 420000,
						month: 2,
					},
					{
						numberBillItems: 3,
						totalPrice: 700000,
						avgTotalPrice: 233333.33333333334,
						minPrice: 140000,
						maxPrice: 420000,
						month: 1,
					},
				],
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
	@Get('statics/monthly/:year')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async getMonthlyBillItemOwnFacilitiesStats(
		@Param('year', ParseIntPipe) year: number,
		@GetCurrentUser('sub') userID: string,
	): Promise<Array<object>> {
		return await this.billItemsService.getMonthlyBillItemOwnFacilitiesStats(
			year,
			userID,
		);
	}

	@ApiOperation({
		summary: 'Find Many Bill-items of Own Facility',
		description: `Find many bill-items of own facility.\n\nRoles: ${UserRole.FACILITY_OWNER}}.`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiDocsPaginationVer2('bill-item')
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
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
	@Get('/:facilityID')
	@Roles(UserRole.FACILITY_OWNER)
	@UseGuards(RolesGuard)
	async findManyBillItemOfOwnFacility(
		@GetCurrentUser('sub') userID: string,
		@Query() query: QueryObject,
		@Param('facilityID') facilityID: string,
	): Promise<ListResponseV2<BillItem>> {
		return await this.billItemsService.findManyBillItemOfOwnFacility(
			query,
			userID,
			facilityID,
		);
	}
}
