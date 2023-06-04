import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiOkResponse,
	ApiParam,
	ApiNotFoundResponse,
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiUnauthorizedResponse,
	ApiForbiddenResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ListOptions,
	ListResponse,
	ErrorResponse,
} from 'src/shared/response/common-response';
import { CountObject, Counter, TargetObject } from './entities/counter.entity';
import { CreateCounterDto } from './dto/create-counter-dto';
import { UpdateCounterDto } from './dto/update-counter-dto';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('counters')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('counters')
export class CounterController {
	@Get()
	@ApiOperation({
		summary: 'Get All counters',
		description: `Only Admin can use this API`,
	})
	@ApiDocsPagination('counters')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						targetObject: TargetObject.FACILITY,
						targetID: '6476ef7d1f1280419cd330fe',
						countObject: CountObject.PACKAGE_TYPE,
						count: 5,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Counter,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'targetObject',
					searchValue: `${TargetObject.FACILITY}`,
					sortField: 'countObject',
					sortOrder: 'asc',
				} as ListOptions<Counter>,
			} as ListResponse<Counter>,
		},
	})
	getAllCounters(@Query() filter: ListOptions<Counter>) {
		console.log(filter);

		//
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get Counter',
		description: `Only Admin can use this API`,
	})
	@ApiParam({ name: 'id', type: String, description: 'Counter ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				targetObject: TargetObject.FACILITY,
				targetID: '6476ef7d1f1280419cd330fe',
				countObject: CountObject.PACKAGE_TYPE,
				count: 5,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Counter,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Counter not found!',
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
	getCounter(@Param('id') id: string) {
		console.log(id);
		//
	}

	@Post()
	@ApiOperation({
		summary: 'Create Counter',
		description: `Only admin can use this API`,
	})
	@ApiBody({
		type: CreateCounterDto,
		examples: {
			test: {
				value: {
					targetObject: TargetObject.FACILITY,
					targetID: '6476ef7d1f1280419cd330fe',
					countObject: CountObject.PACKAGE_TYPE,
					count: 5,
				} as CreateCounterDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				targetObject: TargetObject.FACILITY,
				targetID: '6476ef7d1f1280419cd330fe',
				countObject: CountObject.PACKAGE_TYPE,
				count: 5,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Counter,
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
	createCounter(@Body() data: CreateCounterDto) {
		console.log(data);
		//
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update Counter',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'Counter ID',
	})
	@ApiBody({
		type: UpdateCounterDto,
		examples: {
			test: {
				value: {
					count: 4,
				} as UpdateCounterDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				targetObject: TargetObject.FACILITY,
				targetID: '6476ef7d1f1280419cd330fe',
				countObject: CountObject.PACKAGE_TYPE,
				count: 5,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Counter,
		},
	})
	updateCounter(@Param('id') id: string, @Body() data: UpdateCounterDto) {
		console.log(id, data);
		//
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete Counter',
		description: `Only admin can use this API`,
	})
	@ApiParam({
		name: 'id',
		type: String,
		description: 'Counter ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Counter successful!',
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
				message: 'Counter not found!',
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
	deleteCounter(@Param('id') id: string) {
		console.log(id);
		//
	}
}
