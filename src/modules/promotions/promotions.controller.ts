import {
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from './schemas/promotion.schema';
import { ESortField, ESortOrder } from 'src/shared/enum/sort.enum';

@Controller('promotions')
export class PromotionsController {
	@Get('promotions')
	@ApiTags('promotions')
	@ApiDocsPagination('promotion')
	@ApiOperation({
		summary: 'getManyPromotions',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetId: 'string',
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
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	getManyPromotions(@Query() filter: ListOptions<Promotion>) {
		return 'getManyPromotions';
	}
	@Get('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'getOnePromotion',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetId: 'string',
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
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	getOnePromotion(@Param('id') id: string) {
		return 'getOnePromotion';
	}
	@Post('promotions')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'createPromotion',
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'Created successfully',
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	createPromotion() {
		return 'createPromotion';
	}
	@Patch('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'updatePromotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	updatePromotion(@Param('id') id: string) {
		return 'updatePromotion';
	}
	@Delete('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'deletePromotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	deletePromotion(@Param('id') id: string) {
		return 'deletePromotion';
	}
	@Get('facilities/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionsByOwnerFacility',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetId: 'string',
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
	getPromotionsByOwnerFacility(@Query() filter: ListOptions<Promotion>) {
		return 'getPromotionsByOwnerFacility';
	}
	@Get('facilities/:facilityID/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionByOwnerFacility',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetId: 'string',
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
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	getPromotionByOwnerFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<Promotion>,
	) {
		return 'getPromotionByOwnerFacility';
	}
	@Post('facilities/:facilityID/promotions')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'createPromotionByOwnerFacility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				message: 'Created successfully',
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	createPromotionByOwnerFacility() {
		return 'createPromotionByOwnerFacility';
	}
	@Patch('facilities/:facilityID/promotions/:promotionID')
	@ApiTags('facilities/promotions')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiOperation({
		summary: 'updatePromotionByOwnerFacility',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				message: 'Updated successfully',
			},
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	updatePromotionByOwnerFacility(
		@Param('facilityID') facilityID: string,
		@Param('promotionID') promotionID: string,
	) {
		return 'updatePromotionByOwnerFacility';
	}
	@Delete('facilities/:facilityID/promotions/:promotionID')
	@ApiTags('facilities/promotions')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiOperation({
		summary: 'deletePromotionByOwnerFacility',
	})
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
		status: 403,
		schema: {
			example: {
				code: 403,
				message: `You don't have permission to this access`,
				details: {},
			},
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: 404,
				message: 'Not found document with that ID',
				details: {},
			},
		},
	})
	deletePromotionByOwnerFacility() {
		return 'deletePromotionByOwnerFacility';
	}
	@Get('facilities/:facilityID/promotions/:promotionID')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionOfFacility',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						targetId: 'string',
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
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	getPromotionOfFacility(
		@Param('facilityID') facilityID: string,
		@Param('promotionID') promotionID: string,
	) {
		return 'getPromotionOfFacility';
	}
}
