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
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
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
} from './schemas/promotion.schema';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Controller('promotions')
export class PromotionsController {
	@Get('promotions')
	@ApiTags('promotions')
	@ApiDocsPagination('promotion')
	@ApiOperation({
		summary: 'getManyPromotions',
		description: 'Get many promotions',
	})
	@ApiBody({ type: CreatePromotionDto })
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
	getManyPromotions(
		@Query() filter: ListOptions<Promotion>,
		@Body() createPromotionDto: CreatePromotionDto,
	) {
		return 'getManyPromotions';
	}
	@Get('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'getOnePromotion',
		description: 'Get one promotion',
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
	getOnePromotion(@Param('id') id: string) {
		return 'getOnePromotion';
	}
	@Post('promotions')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'createPromotion',
		description: 'Create one promotion',
	})
	@ApiBody({
		type: Promotion,
		examples: {
			ADMIN: {
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
			} as Promotion,
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
	createPromotion() {
		return 'createPromotion';
	}
	@Patch('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'updatePromotion',
		description: 'Update one promotion',
	})
	@ApiParam({ name: 'id', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: Promotion,
		examples: {
			ADMIN: {
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
			} as Promotion,
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
	updatePromotion(@Param('id') id: string) {
		return 'updatePromotion';
	}
	@Delete('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'deletePromotion',
		description: 'Delete one promotion',
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
	deletePromotion(@Param('id') id: string) {
		return 'deletePromotion';
	}
	@Get('facilities/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionsByOwnerFacility',
		description:
			'Allow user to get many promotions of all promotions of own facility',
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
	getPromotionsByOwnerFacility(@Query() filter: ListOptions<Promotion>) {
		return 'getPromotionsByOwnerFacility';
	}
	@Get('facilities/:facilityID/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionByOwnerFacility',
		description:
			'Allow facility owner to get many promotions of own facility\n\nAllow customer/admin to get many promotions of one facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
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
		description:
			'Allow facility owner to create many promotions of own facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: Promotion,
		examples: {
			OwnerFacility: {
				targetID: 'string',
				type: PromotionType.FACILITY,
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
			} as Promotion,
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
	createPromotionByOwnerFacility() {
		return 'createPromotionByOwnerFacility';
	}
	@Patch('facilities/:facilityID/promotions/:promotionID')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'updatePromotionByOwnerFacility',
		description: 'Allow facility owner to update one promotion of own facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: Promotion,
		examples: {
			OwnerFacility: {
				targetID: 'string',
				type: PromotionType.FACILITY,
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
			} as Promotion,
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
		description: 'Allow facility owner to delete one promotion of own facility',
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
	deletePromotionByOwnerFacility() {
		return 'deletePromotionByOwnerFacility';
	}
	@Get('facilities/:facilityID/promotions/:promotionID')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionOfFacility',
		description:
			'Allow facility owner to get one promotion of own facility\n\nAllow customer/admin to get one promotions of one facility',
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
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	getPromotionOfFacility(
		@Param('facilityID') facilityID: string,
		@Param('promotionID') promotionID: string,
	) {
		return 'getPromotionOfFacility';
	}
}
