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
import { UpdateFacilityScheduleDto } from './dto/update-facility-schedule-dto';
import { Facility } from '../facility/schemas/facility.schema';
import { FacilityScheduleService } from './facility-schedule.service';
import { OwnershipScheduleGuard } from 'src/guards/ownership/ownership-schedule.guard';
import { Public } from '../auth/decorators/public.decorator';
import { MongoIdValidationPipe } from 'src/pipes/parseMongoId.pipe';

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
								startTime: new Date('7/10/2023 06:00:00'),
								endTime: new Date('7/10/2023 12:00:00'),
							},
							{
								startTime: new Date('7/10/2023 13:00:00'),
								endTime: new Date('7/10/2023 19:00:00'),
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
		type: UpdateFacilityScheduleDto,
		examples: {
			Daily: {
				value: {
					openTime: [
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
						},
					] as OpenTimeDto[],
				} as UpdateFacilityScheduleDto,
			},
			Weekly: {
				value: {
					openTime: [
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.MONDAY,
						},
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.TUESDAY,
						},
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.WEDNESDAY,
						},
					] as OpenTimeDto[],
				} as UpdateFacilityScheduleDto,
			},
			Monthly: {
				value: {
					openTime: [
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
							dayOfMonth: 1,
						},
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
							dayOfMonth: 2,
						},
						{
							shift: [
								{
									startTime: new Date('7/10/2023 06:00:00'),
									endTime: new Date('7/10/2023 11:00:00'),
								},
								{
									startTime: new Date('7/10/2023 13:00:00'),
									endTime: new Date('7/10/2023 19:00:00'),
								},
							] as ShiftTimeDto[],
							dayOfMonth: 3,
						},
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
						shift: [
							{
								startTime: new Date('7/10/2023 06:00:00'),
								endTime: new Date('7/10/2023 12:00:00'),
							},
							{
								startTime: new Date('7/10/2023 13:00:00'),
								endTime: new Date('7/10/2023 19:00:00'),
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
		@Body() data: UpdateFacilityScheduleDto,
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
