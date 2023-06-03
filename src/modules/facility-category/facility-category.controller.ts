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
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { CategoryType, FacilityCategory } from './entities/facility-category';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { CreateCategoryDto } from './dto/create-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

@ApiTags('categories')
@Controller('categories')
export class FacilityCategoryController {
	@Get()
	@ApiOperation({
		summary: 'Get All categories',
		description: `All roles can use this API`,
	})
	@ApiDocsPagination('categories')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						type: CategoryType.AEROPIC,
						name: 'AEROPIC',
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

	@Get(':id')
	@ApiOperation({
		summary: 'Get Category',
		description: `All roles can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Category ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: CategoryType.GYM,
				name: 'GYM',
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
	getCategory(@Param('id') id: string) {
		console.log(id);
		//
	}

	@Post()
	@ApiOperation({
		summary: 'Create category',
		description: `Only admin can use this API`,
	})
	@ApiBody({
		type: CreateCategoryDto,
		examples: {
			test: {
				value: {
					type: CategoryType.SPA,
					name: 'SPA',
				} as CreateCategoryDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: CategoryType.GYM,
				name: 'GYM',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilityCategory,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
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
	createCategory(@Body() data: CreateCategoryDto) {
		console.log(data);
		//
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update category',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'Category ID',
	})
	@ApiBody({
		type: UpdateCategoryDto,
		examples: {
			test: {
				value: {
					name: 'string',
				} as UpdateCategoryDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				type: CategoryType.GYM,
				name: 'GYM',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilityCategory,
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Not found Schedule to update!',
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
	updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
		console.log(id, data);
		//
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete category',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'Category ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Category successful!',
			},
		},
	})
	@ApiUnauthorizedResponse({
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiForbiddenResponse({
		schema: {
			example: {
				code: '403',
				message: 'Forbidden resource',
				details: null,
			} as ErrorResponse<null>,
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
	deleteCategory(@Param('id') id: string) {
		console.log(id);
		//
	}
}
