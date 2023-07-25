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
import { ErrorResponse } from 'src/shared/response/common-response';
import {
	FacilitySchedule,
	ScheduleType,
} from './entities/facility-schedule.entity';
import { OpenTime, dayOfWeek } from './entities/open-time.entity';
import { ShiftTime } from './entities/shift-time.entity';
import { OpenTimeDto } from './dto/open-time-dto';
import { ShiftTimeDto } from './dto/shift-time-dto';
import { Facility } from '../facility/schemas/facility.schema';
import { FacilityScheduleService } from './facility-schedule.service';
import { OwnershipScheduleGuard } from 'src/guards/ownership/ownership-schedule.guard';
import { Public } from '../auth/decorators/public.decorator';
import { MongoIdValidationPipe } from 'src/pipes/parseMongoId.pipe';
import { FacilityScheduleDto } from './dto/facility-schedule-dto';

@ApiTags('schedules')
@Controller('schedules')
export class FacilityScheduleController {
	constructor(private readonly scheduleService: FacilityScheduleService) {}

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
						shift: [
							{
								startTime: '06:00',
								endTime: '12:00',
							},
							{
								startTime: '13:00',
								endTime: '19:00',
							},
						] as ShiftTime[],
					},
				] as OpenTime[],
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
	async getSchedule(
		@Param('scheduleID', MongoIdValidationPipe) scheduleID: string,
	) {
		return await this.scheduleService.findOneByID(scheduleID, 'facilityID');
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipScheduleGuard)
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
		type: FacilityScheduleDto,
		examples: {
			Daily: {
				value: {
					type: ScheduleType.DAILY,
					openTime: [
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
			},
			Weekly: {
				value: {
					type: ScheduleType.WEEKLY,
					openTime: [
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.MONDAY,
						},
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.TUESDAY,
						},
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.WEDNESDAY,
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
			},
			Monthly: {
				value: {
					type: ScheduleType.MONTHLY,
					openTime: [
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
							dayOfMonth: 1,
						},
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
							dayOfMonth: 2,
						},
						{
							shift: [
								{
									startTime: '06:00',
									endTime: '10:00',
								},
								{
									startTime: '13:00',
									endTime: '18:00',
								},
							] as ShiftTimeDto[],
							dayOfMonth: 3,
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
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
						shift: [
							{
								startTime: '06:00',
								endTime: '10:00',
							},
							{
								startTime: '13:00',
								endTime: '18:00',
							},
						] as ShiftTime[],
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
	async updateSchedule(
		@Param('scheduleID') scheduleID: string,
		@Body() data: FacilityScheduleDto,
	) {
		return await this.scheduleService.update(scheduleID, data);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipScheduleGuard)
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
	async deleteSchedule(@Param('scheduleID') scheduleID: string) {
		return await this.scheduleService.delete(scheduleID);
	}
}
