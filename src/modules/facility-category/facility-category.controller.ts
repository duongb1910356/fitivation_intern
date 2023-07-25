import { Controller, Get, Param, Query } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { FacilityCategory } from './entities/facility-category';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { FacilityCategoryService } from './facility-category.service';
import { Public } from '../auth/decorators/public.decorator';
import { MongoIdValidationPipe } from 'src/pipes/parseMongoId.pipe';

@ApiTags('categories')
@Controller('categories')
@Public()
export class FacilityCategoryController {
	constructor(
		private readonly facilityCategoryService: FacilityCategoryService,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Get All categories',
		description: `All roles can use this API`,
	})
	@ApiDocsPagination('categorie')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						type: 'AEROPIC',
						name: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as FacilityCategory,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
				} as ListOptions<FacilityCategory>,
			} as ListResponse<FacilityCategory>,
		},
	})
	async getAllCategory(@Query() filter: ListOptions<FacilityCategory>) {
		return await this.facilityCategoryService.findMany(filter);
	}

	@Get(':categoryID')
	@ApiOperation({
		summary: 'Get Category',
		description: `All roles can use this API`,
	})
	@ApiParam({ name: 'categoryID', type: String, description: 'Category ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: 'GYM',
				name: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilityCategory,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Category not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async getCategory(
		@Param('categoryID', MongoIdValidationPipe) categoryID: string,
	) {
		return await this.facilityCategoryService.findOneByID(categoryID);
	}
}
