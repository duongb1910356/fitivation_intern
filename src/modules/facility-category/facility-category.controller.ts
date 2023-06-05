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
import { Public } from '../auth/utils';

@ApiTags('categories')
@Public()
@Controller('categories')
export class FacilityCategoryController {
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
	getAllCategory(@Query() filter: ListOptions<FacilityCategory>) {
		console.log(filter);

		//
	}

	@Get(':categoryId')
	@ApiOperation({
		summary: 'Get Category',
		description: `All roles can use this API`,
	})
	@ApiParam({ name: 'categoryId', type: String, description: 'Category ID' })
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
	getCategory(@Param('categoryId') categoryId: string) {
		console.log(categoryId);
		//
	}
}
