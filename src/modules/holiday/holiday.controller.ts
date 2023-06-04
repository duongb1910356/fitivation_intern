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
	ApiBadRequestResponse,
	ApiBearerAuth,
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
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ListOptions,
	ListResponse,
	ErrorResponse,
} from 'src/shared/response/common-response';
import { Facility } from '../facility/schemas/facility.schema';
import { UserRole } from '../users/schemas/user.schema';
import { Holiday } from './entities/holiday.entity';
import { Public } from '../auth/utils';
import { HolidayDto } from './dto/holiday-dto';

@ApiTags('holidays')
@Controller()
export class HolidayController {
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('holidays')
	@ApiOperation({
		summary: 'Get All Holidays',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('Holiday')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						startDate: new Date(),
						endDate: new Date(),
						content: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Holiday,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'startDate',
					sortOrder: 'asc',
				} as ListOptions<Holiday>,
			} as ListResponse<Holiday>,
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
	getAllHolidays(@Query() filter: ListOptions<Holiday>) {
		console.log(filter);
		//
	}

	@Public()
	@Get('holidays/holidayId')
	@ApiOperation({
		summary: 'Get holiday by holidayId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'holidayId', type: String, description: 'Holiday ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				startDate: new Date(),
				endDate: new Date(),
				content: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Holiday,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Holiday not found!',
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
	getHoliday(@Param('holidayId') holidayId: string) {
		console.log(holidayId);
		//
	}

	@Public()
	@Get('facilities/:facilityId/holidays')
	@ApiOperation({
		summary: 'Get All Holidays by facilityId',
		description: `All role can use this API`,
	})
	@ApiParam({
		name: 'facilityId',
		type: String,
		description: 'Facility ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						startDate: new Date(),
						endDate: new Date(),
						content: 'string',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Holiday,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'startDate',
					sortOrder: 'asc',
				} as ListOptions<Holiday>,
			} as ListResponse<Holiday>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Facility not found!',
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
	getAllHolidaysByFacility(
		@Param('facilityId') facilityId: string,
		@Query() filter: ListOptions<Holiday>,
	) {
		console.log(facilityId, filter);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Post('facilities/:facilityId/holidays')
	@ApiOperation({
		summary: 'Create new Holiday by facilityId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityId',
		type: String,
		description: 'Facility ID',
	})
	@ApiBody({
		type: HolidayDto,
		examples: {
			test: {
				value: {
					startDate: new Date(),
					endDate: new Date(),
					content: 'string',
				} as HolidayDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				startDate: new Date(),
				endDate: new Date(),
				content: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Holiday,
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
	createHolidayByFacility(
		@Param('facilityId') facilityId: string,
		@Body() data: HolidayDto,
	) {
		console.log(facilityId, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Patch('holiday/:holidayId')
	@ApiOperation({
		summary: 'Update Holiday by holidayId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'holidayId',
		type: String,
		description: 'Holiday ID',
	})
	@ApiBody({
		type: HolidayDto,
		examples: {
			test: {
				value: {
					startDate: new Date(),
					endDate: new Date(),
					content: 'string',
				} as HolidayDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				startDate: new Date(),
				endDate: new Date(),
				content: 'string',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Holiday,
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
				message: 'Not found Holiday to update!',
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
	updateHoliday(
		@Param('holidayId') holidayId: string,
		@Body() data: HolidayDto,
	) {
		console.log(holidayId, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Delete('holidays/:holidayId')
	@ApiOperation({
		summary: 'Delete Holiday by holidayId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'holidayId',
		type: String,
		description: 'Holiday ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Holiday successful!',
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
				message: 'Holiday not found!',
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
	deleteHoliday(@Param('holidayId') holidayId: string) {
		console.log(holidayId);
		//
	}
}
