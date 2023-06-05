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
import { ListOptions } from 'src/shared/response/common-response';
import { Promotion } from './schemas/promotion.schema';

@Controller('promotions')
export class PromotionsController {
	@Get('promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'getManyPromotions',
	})
	getManyPromotions(@Query() filter: ListOptions<Promotion>) {
		return 'getManyPromotions';
	}
	@Get('promotions/:id')
	@ApiTags('promotions')
	@ApiOperation({
		summary: 'getOnePromotion',
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
	getPromotionsByOwnerFacility(@Query() filter: ListOptions<Promotion>) {
		return 'getPromotionsByOwnerFacility';
	}
	@Get('facilities/:facilityID/promotions')
	@ApiDocsPagination('promotion')
	@ApiTags('facilities/promotions')
	@ApiOperation({
		summary: 'getPromotionByOwnerFacility',
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
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	getPromotionOfFacility(
		@Param('facilityID') facilityID: string,
		@Param('promotionID') promotionID: string,
	) {
		return 'getPromotionOfFacility';
	}
}
