import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BillItemsService } from './bill-items.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { BillItem, BillItemStatus } from './schemas/bill-item.schema';
import { ErrorResponse } from 'src/shared/response/common-response';
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
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { UserRole } from '../users/schemas/user.schema';
import { ListResponse, QueryObject } from 'src/shared/utils/query-api';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { TokenPayload } from '../auth/types/token-payload.type';

@Controller('bill-items')
@ApiTags('bill-items')
@ApiBearerAuth()
export class BillItemsController {
	constructor(private readonly billItemsService: BillItemsService) {}

	@Get()
	@ApiOperation({
		summary: 'findManyBillItems',
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
						ownerFacilityID: 'string',
						accountID: 'string',
						facilityInfo: {
							brandName: 'string',
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
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
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
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	findManyBillItems(
		@Query() query: QueryObject,
		@GetCurrentUser() user: TokenPayload,
	) {
		return this.billItemsService.findMany(query, user);
	}

	@ApiOperation({
		summary: 'findOneBillItem',
		description:
			'Allow customer to get one of their bill-items\n\nAllow admin to get one of bill-item\n\nAllow facility owner to get one of bill-item',
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
				queryOptions: {
					sort: 'string',
					fields: 'string',
					limit: 10,
					page: 0,
				} as QueryObject,
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
	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	@UseGuards(RolesGuard)
	findOneBillItem(
		@Param('id') id: string,
		@GetCurrentUser() user: TokenPayload,
	): Promise<BillItem> {
		return this.billItemsService.findOneByID(id, user);
	}
}
