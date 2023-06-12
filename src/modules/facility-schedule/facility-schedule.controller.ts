import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { ErrorResponse } from 'src/shared/response/common-response';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';
import {
	FacilitySchedule,
	ScheduleType,
} from './entities/facility-schedule.entity';
import { OpenTime, dayOfWeek } from './entities/open-time.entity';
import { ShiftTime } from './entities/shift-time.entity';
import { Public } from '../auth/utils';
import { OpenTimeDto } from './dto/open-time-dto';
import { ShiftTimeDto } from './dto/shift-time-dto';
import { UpdateFacilityScheduleDto } from './dto/update-facility-schedule-dto';
import { Facility } from '../facility/schemas/facility.schema';

@ApiTags('schedules')
@Controller('schedules')
export class FacilityScheduleController {
	@Public()
	@Get(':scheduleID')
	@ApiOperation({
		summary: 'Get Schedule by scheduleID',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'scheduleID', type: String, description: 'Schedule ID' })
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
	getSchedule(@Param('scheduleID') scheduleID: string) {
		console.log(scheduleID);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
	@Patch(':scheduleID')
	@ApiOperation({
		summary: 'Update Schedule by scheduleID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'scheduleID',
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
		@Param('scheduleID') scheduleID: string,
		@Body() data: UpdateFacilityScheduleDto,
	) {
		console.log(scheduleID, data);
		//
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.FACILITY_OWNER)
	@Delete(':scheduleID')
	@ApiOperation({
		summary: 'Delete Schedule Type by scheduleID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'scheduleID',
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
	deleteSchedule(@Param('scheduleID') scheduleID: string) {
		console.log(scheduleID);
		//
	}
}
