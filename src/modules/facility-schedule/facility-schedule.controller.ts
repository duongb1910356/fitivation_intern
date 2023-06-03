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
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';
import {
	FacilitySchedule,
	ScheduleType,
} from './entities/facility-schedule.entity';
import { OpenTime, dayOfWeek } from './entities/open-time.entity';
import { ShiftTime } from './entities/shift-time.entity';
import { Public } from '../auth/utils';
import { CreateFacilityScheduleDto } from './dto/create-facility-schedule-dto';
import { OpenTimeDto } from './dto/open-time-dto';
import { ShiftTimeDto } from './dto/shift-time-dto';
import { UpdateFacilityScheduleDto } from './dto/update-facility-schedule-dto';
import { Facility } from '../facility/schemas/facility.schema';

@ApiTags('schedules')
@Controller()
export class FacilityScheduleController {
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get('/schedules')
	@ApiOperation({
		summary: 'Get All Schedules',
		description: `Only admin can use this API`,
	})
	@ApiDocsPagination('Schedules')
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						type: ScheduleType.DAILY,
						openTime: [
							{
								shift: {
									startTime: new Date(),
									endTime: new Date(),
								} as ShiftTime,
							} as OpenTime,
						],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as FacilitySchedule,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'type',
					sortOrder: 'asc',
				} as ListOptions<FacilitySchedule>,
			} as ListResponse<FacilitySchedule>,
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
	getAllSchedules(@Query() filter: ListOptions<FacilitySchedule>) {
		console.log(filter);
		//
	}

	@Public()
	@Get('schedules/:scheduleId')
	@ApiOperation({
		summary: 'Get Schedule by scheduleId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'scheduleId', type: String, description: 'Schedule ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				type: ScheduleType.DAILY,
				openTime: [
					{
						shift: {
							startTime: new Date(),
							endTime: new Date(),
						} as ShiftTime,
					} as OpenTime,
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilitySchedule,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Schedule not found!',
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
	getSchedule(@Param('scheduleId') scheduleId: string) {
		console.log(scheduleId);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Get('facilities/:facilityId/schedules')
	@ApiOperation({
		summary: 'Get All Schedule by facilityId',
		description: `Only Owner can use this API`,
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
						type: ScheduleType.DAILY,
						openTime: [
							{
								shift: {
									startTime: new Date(),
									endTime: new Date(),
								} as ShiftTime,
							} as OpenTime,
						],
						createdAt: new Date(),
						updatedAt: new Date(),
					} as FacilitySchedule,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'facilityID',
					searchValue: 'string',
					sortField: 'type',
					sortOrder: 'asc',
				} as ListOptions<FacilitySchedule>,
			} as ListResponse<FacilitySchedule>,
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
	getAllSchedulesByFacility(
		@Param('facilityId') facilityId: string,
		@Query() filter: ListOptions<FacilitySchedule>,
	) {
		console.log(facilityId, filter);
		//
	}

	@Public()
	@Get('facilities/:facilityId/schedules/current')
	@ApiOperation({
		summary: 'Get Current Schedule by facilityId',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				type: ScheduleType.DAILY,
				openTime: [
					{
						shift: {
							startTime: new Date(),
							endTime: new Date(),
						} as ShiftTime,
					} as OpenTime,
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilitySchedule,
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
	getCurrentScheduleByFacility(@Param('facilityId') facilityId: string) {
		console.log(facilityId);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Post('facilities/:facilityId/schedules')
	@ApiOperation({
		summary: 'Create new Schedule by facilityId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityId',
		type: String,
		description: 'Facility ID',
	})
	@ApiBody({
		type: CreateFacilityScheduleDto,
		examples: {
			Daily: {
				value: {
					type: ScheduleType.DAILY,
					OpenTime: [
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
						},
					] as OpenTimeDto[],
				} as CreateFacilityScheduleDto,
			},
			Weekly: {
				value: {
					type: ScheduleType.WEEKLY,
					OpenTime: [
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfWeek: dayOfWeek.MONDAY,
						},
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfWeek: dayOfWeek.TUESDAY,
						},
					] as OpenTimeDto[],
				} as CreateFacilityScheduleDto,
			},
			Monthly: {
				value: {
					type: ScheduleType.MONTHLY,
					OpenTime: [
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfMonth: 1,
						},
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
								dayOfMonth: 2,
							} as ShiftTimeDto,
						},
					] as OpenTimeDto[],
				} as CreateFacilityScheduleDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				type: ScheduleType.DAILY,
				openTime: [
					{
						shift: {
							startTime: new Date(),
							endTime: new Date(),
						} as ShiftTime,
					} as OpenTime,
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilitySchedule,
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
	createScheduleByFacility(
		@Param('facilityId') facilityId: string,
		@Body() data: CreateFacilityScheduleDto,
	) {
		console.log(facilityId, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Patch('schedules/:scheduleId')
	@ApiOperation({
		summary: 'Update Schedule by scheduleId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'scheduleId',
		type: String,
		description: 'Schedule ID',
	})
	@ApiBody({
		type: UpdateFacilityScheduleDto,
		examples: {
			Daily: {
				value: {
					OpenTime: [
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
						},
					],
				} as UpdateFacilityScheduleDto,
			},
			Weekly: {
				value: {
					OpenTime: [
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfWeek: dayOfWeek.MONDAY,
						},
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfWeek: dayOfWeek.TUESDAY,
						},
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfWeek: dayOfWeek.WEDNESDAY,
						},
						{},
					] as OpenTimeDto[],
				} as UpdateFacilityScheduleDto,
			},
			Monthly: {
				value: {
					OpenTime: [
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfMonth: 1,
						},
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfMonth: 2,
						},
						{
							shift: {
								startTime: new Date(),
								endTime: new Date(),
							} as ShiftTimeDto,
							dayOfMonth: 3,
						},
						{},
					] as OpenTimeDto[],
				} as UpdateFacilityScheduleDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				type: ScheduleType.DAILY,
				openTime: [
					{
						shift: {
							startTime: new Date(),
							endTime: new Date(),
						} as ShiftTime,
					} as OpenTime,
				],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as FacilitySchedule,
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
	updateSchedule(
		@Param('scheduleId') scheduleId: string,
		@Body() data: UpdateFacilityScheduleDto,
	) {
		console.log(scheduleId, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
	@Delete('schedules/:scheduleId')
	@ApiOperation({
		summary: 'Delete Schedule Type by scheduleId',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'scheduleId',
		type: String,
		description: 'Schedule ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Delete Schedule successful!',
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
				message: 'Schedule not found!',
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
	deleteSchedule(@Param('scheduleId') scheduleId: string) {
		console.log(scheduleId);
		//
	}
}
