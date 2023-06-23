import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { Facility } from './schemas/facility.schema';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Review } from '../reviews/schemas/reviews.schema';
import { UpdateFacilityDto } from './dto/update-facility-dto';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Photo } from '../photo/schemas/photo.schema';
import { State, Status, ScheduleType } from '../../shared/enum/facility.enum';
import { ShiftTime } from '../facility-schedule/entities/shift-time.entity';
import { OpenTime } from '../facility-schedule/entities/open-time.entity';
import { FacilitySchedule } from '../facility-schedule/entities/facility-schedule.entity';
import { Holiday } from '../holiday/entities/holiday.entity';
import { PackageType } from '../package-type/entities/package-type.entity';
import { ShiftTimeDto } from '../facility-schedule/dto/shift-time-dto';
import { OpenTimeDto } from '../facility-schedule/dto/open-time-dto';
import { CreateFacilityScheduleDto } from '../facility-schedule/dto/create-facility-schedule-dto';
import { dayOfWeek } from '../facility-schedule/entities/open-time.entity';
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { UpdatePhotoOfFacilityDto } from './dto/update-photo-facility';
import { Public } from '../auth/decorators/public.decorator';
import { OwnershipFacilityGuard } from 'src/guards/ownership/ownership-facility.guard';
import { FacilityService } from './facility.service';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { User, UserRole } from '../users/schemas/user.schema';
import { Attendance } from '../attendance/entities/attendance.entity';

@ApiTags('facilities')
@Controller('facilities')
export class FacilityController {
	constructor(private readonly facilityService: FacilityService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Search facility',
	})
	@ApiDocsPagination('Facility')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '1233456',
						brandID: {},
						facilityCategoryID: {},
						ownerID: {},
						name: 'City gym',
						address: {
							street: '30/4',
							commune: 'Phường Xuân Khánh',
							communeCode: '011',
							district: 'Quận Ninh Kiều',
							districtCode: '056',
							province: 'Thành phố Cần Thơ',
							provinceCode: '065',
						},
						summary: 'Phòng gym thân thiện',
						description: 'Nhiều dụng cụ tập luyện',
						coordinationLocation: [65, 56],
						state: State.ACTIVE,
						status: Status.APPROVED,
						averageStar: null,
						photos: [
							{
								_id: '123456789',
								ownerID: 'id-bucket',
								name: 'name-image',
								imageURL: 'http://localhost:8080/id-bucket/name-image',
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						],
						reviews: [
							{
								_id: '123456789',
								accountID: {},
								facilityID: {},
								comment: 'Đáng để trải nghiệm',
								rating: 5,
								photos: [
									{
										_id: '12345678dsgdgsdxdg4',
										ownerID: 'bucket1',
										name: 'image-name',
										imageURL: 'http://localhost:8080/bucket1/image-name',
										createdAt: new Date(),
										updatedAt: new Date(),
									},
								] as Photo[],
								createdAt: new Date(),
								updatedAt: new Date(),
							},
						],
						scheduleType: ScheduleType.DAILY,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as Facility,
				],
				total: 1,
				options: {
					limit: 1,
					offet: 1,
					search: 'string',
					sortBy: 'createdAt',
					sortOrder: 'asc',
				} as ListOptions<Facility>,
			} as ListResponse<Facility>,
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getAllFacility() {
		//
	}

	@Public()
	@Get(':facilityID')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiOperation({
		summary: 'Get facility by id',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			_id: '1233456',
			brandID: {},
			facilityCategoryID: {},
			ownerID: {},
			name: 'City gym',
			address: {
				street: '30/4',
				commune: 'Phường Xuân Khánh',
				communeCode: '011',
				district: 'Quận Ninh Kiều',
				districtCode: '056',
				province: 'Thành phố Cần Thơ',
				provinceCode: '065',
			},
			summary: 'Phòng gym thân thiện',
			description: 'Nhiều dụng cụ tập luyện',
			coordinationLocation: [65, 56],
			state: State.ACTIVE,
			status: Status.APPROVED,
			averageStar: null,
			photos: [
				{
					_id: '123456789',
					ownerID: 'id-bucket',
					name: 'name-image',
					imageURL: 'http://localhost:8080/id-bucket/name-image',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			reviews: [
				{
					_id: '123456789',
					accountID: {},
					facilityID: {},
					comment: 'Đáng để trải nghiệm',
					rating: 5,
					photos: [
						{
							_id: '12345678dsgdgsdxdg4',
							ownerID: 'bucket1',
							name: 'image-name',
							imageURL: 'http://localhost:8080/bucket1/image-name',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					] as Photo[],
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Facility,
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getFacilityById() {
		//
	}

	@Public()
	@Get(':facilityID/reviews')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiOperation({
		summary: 'Get review of facility by facilityID',
	})
	@ApiDocsPagination('Review')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 1,
					items: [
						{
							_id: '123456789',
							accountID: {},
							facilityID: {},
							comment: 'Đáng để trải nghiệm',
							rating: 5,
							photos: [
								{
									_id: '12345678dsgdgsdxdg4',
									ownerID: 'bucket1',
									name: 'image-name',
									imageURL: 'http://localhost:8080/bucket1/image-name',
									createdAt: new Date(),
									updatedAt: new Date(),
								},
							] as Photo[],
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					options: {
						limit: 1,
						offet: 1,
						search: 'string',
						sortBy: 'createdAt',
						sortOrder: 'asc',
					} as ListOptions<Review>,
				} as ListResponse<Review>,
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getReviewOfFacility() {
		//
	}

	@Public()
	@Get('nearby/:latitude/:longitude')
	@ApiParam({ name: 'latitude', type: Number, description: 'latitude' })
	@ApiParam({ name: 'longitude', type: Number, description: 'longitude' })
	@ApiOperation({
		summary: 'Find the nearest facilites',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 1,
					items: [
						{
							_id: '1233456',
							brandID: {},
							facilityCategoryID: {},
							ownerID: {},
							name: 'City gym',
							address: {
								street: '30/4',
								commune: 'Phường Xuân Khánh',
								communeCode: '011',
								district: 'Quận Ninh Kiều',
								districtCode: '056',
								province: 'Thành phố Cần Thơ',
								provinceCode: '065',
							},
							summary: 'Phòng gym thân thiện',
							description: 'Nhiều dụng cụ tập luyện',
							coordinationLocation: [65, 56],
							state: State.ACTIVE,
							status: Status.APPROVED,
							averageStar: 5,
							photos: [],
							reviews: [],
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					options: {
						limit: 1,
						offet: 1,
						search: 'string',
						sortBy: 'averageStar',
						sortOrder: 'asc',
					} as ListOptions<Facility>,
				} as ListResponse<Facility>,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getFacilityByLocation() {
		//
	}

	@Public()
	@Get(':facilityID/photos')
	@ApiParam({ name: 'facilityID', type: String, description: 'id facility' })
	@ApiOperation({
		summary: 'Get photos of facility',
	})
	@ApiDocsPagination('Photo')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					total: 1,
					items: [
						{
							_id: '123456789',
							ownerID: 'id-bucket',
							name: 'name-image',
							imageURL: 'http://localhost:8080/id-bucket/name-image',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					options: {
						limit: 1,
						offset: 1,
						searchField: 'ownerID',
						searchValue: 'id-bucket',
						sortField: 'createdAt',
						sortOrder: 'asc',
					} as ListOptions<Photo>,
				} as ListResponse<Photo>,
			},
		},
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Photo not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid',
	})
	getPhotoFacility() {
		//
	}

	// ATTENDANCE
	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.MEMBER)
	@Get(':facilityID/attendance')
	@ApiOperation({
		summary: 'Get Attendance by facilityId of User',
		description: `Member can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
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
	async getAttendancesByFacility(
		@Param('facilityID') facilityID: string,
		@Req() req: any,
	) {
		return await this.facilityService.getAttendance(facilityID, req.user.uid);
	}

	@ApiBearerAuth()
	@UseGuards(RolesGuard)
	@Roles(UserRole.MEMBER)
	@Public()
	@Post(':facilityID/attendance')
	@ApiOperation({
		summary: 'Create Attendance by facilityId of User',
		description: `Member can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiOkResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				accountID: {} as unknown as User,
				date: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Attendance,
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
	async createAttendanceByFacility(
		@Param('facilityID') facilityID: string,
		@Req() req: any,
	) {
		return await this.facilityService.createAttendance(
			facilityID,
			req.user.uid,
		);
	}

	//SCHEDULE
	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Get(':facilityID/schedules')
	@ApiOperation({
		summary: 'Get All Schedule by facilityID',
		description: `Only Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
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
	getAllSchedulesByFacility(@Param('facilityID') facilityID: string) {
		return this.facilityService.findAllSchedules(facilityID);
	}

	@Public()
	@Get(':facilityID/schedules/current')
	@ApiOperation({
		summary: 'Get Current Schedule by facilityID',
		description: `All role can use this API`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
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
	async getCurrentScheduleByFacility(@Param('facilityID') facilityID: string) {
		return this.facilityService.getCurrentSchedule(facilityID);
	}

	@Public()
	@Get(':facilityID/holidays')
	@ApiDocsPagination('holiday')
	@ApiOperation({
		summary: 'Get All Holidays by facilityID',
		description: `All role can use this API`,
	})
	@ApiQuery({
		name: 'startDate',
		type: String,
		required: false,
		description: 'startDate',
	})
	@ApiQuery({
		name: 'endDate',
		type: String,
		required: false,
		description: 'endDate',
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
	async getAllHolidaysByFacility(
		@Param('facilityID') facilityID: string,
		@Query() options: ListOptions<Holiday>,
	) {
		return await this.facilityService.findAllHoliday(facilityID, options);
	}

	@Public()
	@Get(':facilityID/package-types')
	@ApiOperation({
		summary: 'Get all Package Type by facilityID',
		description: `All role can use this API \n Only sort by Order`,
	})
	@ApiDocsPagination('PackageType')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiOkResponse({
		schema: {
			example: {
				items: [
					{
						_id: '6476ef7d1f0419cd330fe128',
						facilityID: {} as unknown as Facility,
						name: 'GYM GYM 1',
						description: 'cơ sở tập gym chất lượng',
						price: 100000,
						order: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					} as PackageType,
				],
				total: 1,
				options: {
					limit: 10,
					offset: 0,
					searchField: 'name',
					searchValue: 'string',
					sortField: '_id',
					sortOrder: 'asc',
				} as ListOptions<PackageType>,
			} as ListResponse<PackageType>,
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
	async getAllPackageTypeByFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<PackageType>,
	) {
		return await this.facilityService.getAllPackageType(facilityID, filter);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/schedules')
	@ApiOperation({
		summary: 'Create new Schedule by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
		type: String,
		description: 'Facility ID',
	})
	@ApiBody({
		type: CreateFacilityScheduleDto,
		examples: {
			Daily: {
				value: {
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
							] as ShiftTimeDto[],
						},
					] as OpenTimeDto[],
				} as CreateFacilityScheduleDto,
			},
			Weekly: {
				value: {
					type: ScheduleType.WEEKLY,
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
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.MONDAY,
						},
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
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.TUESDAY,
						},
					] as OpenTimeDto[],
				} as CreateFacilityScheduleDto,
			},
			Monthly: {
				value: {
					type: ScheduleType.MONTHLY,
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
							] as ShiftTimeDto[],
							dayOfMonth: 1,
						},
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
							] as ShiftTimeDto[],
							dayOfMonth: 2,
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
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async createScheduleByFacility(
		@Param('facilityID') facilityID: string,
		@Body() data: CreateFacilityScheduleDto,
	) {
		return this.facilityService.createSchedule(facilityID, data);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/holidays')
	@ApiOperation({
		summary: 'Create new Holiday by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({
		name: 'facilityID',
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
				startDate: new Date(+1),
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
	async createHolidayByFacility(
		@Param('facilityID') facilityID: string,
		@Body() data: HolidayDto,
	) {
		return await this.facilityService.createHoliday(facilityID, data);
	}

	// @ApiBearerAuth()
	// @UseGuards(OwnershipFacilityGuard)
	@Public()
	@Post(':facilityID/package-types')
	@ApiOperation({
		summary: 'Create new Package Type by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: CreatePackageTypeDto,
		examples: {
			test1: {
				value: {
					name: 'Standard Package 1',
					description: 'This is a standard package 1',
					price: 998.99,
				} as CreatePackageTypeDto,
			},
			test2: {
				value: {
					name: 'Standard Package 2',
					description: 'This is a standard package 2',
					price: 888.88,
				} as CreatePackageTypeDto,
			},
		},
	})
	@ApiCreatedResponse({
		schema: {
			example: {
				_id: '6476ef7d1f0419cd330fe128',
				facilityID: {} as unknown as Facility,
				name: 'GYM GYM 1',
				description: 'cơ sở tập gym chất lượng',
				price: 100000,
				order: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as PackageType,
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
	async createPackageType(
		@Param('facilityID') facilityID: string,
		@Body() data: CreatePackageTypeDto,
	) {
		return await this.facilityService.createPackageType(facilityID, data);
	}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new facility',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		type: CreateFacilityDto,
		examples: {
			example1: {
				value: {
					brandID: '1123456',
					facilityCategoryID: '1233',
					name: 'City gym',
					address: {
						street: 'string',
						province: 'string',
						provinceCode: 'string',
						district: 'string',
						districtCode: 'string',
						commune: 'string',
						communeCode: 'string',
					},
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'HIỆN ĐẠI BẬT NHẤT',
					coordinatesLocation: [45, 54],
					scheduleType: ScheduleType.WEEKLY,
					photos: [{ file: null }],
				} as CreateFacilityDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: '1233456',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					summary: 'Phòng gym thân thiện',
					description: 'Nhiều dụng cụ tập luyện',
					coordinationLocation: [65, 56],
					state: State.ACTIVE,
					status: Status.APPROVED,
					averageStar: 5,
					photos: [],
					reviews: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FilesInterceptor('files'))
	createFacility() {
		//
	}

	@Delete(':facilityID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete Facility by facilityID',
	})
	@ApiParam({ name: 'id', type: String, description: 'Facility ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: null,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Facility not found!',
	})
	deleteFacilityById() {
		//
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Patch(':facilityID/package-types/swap-order')
	@ApiOperation({
		summary: 'Swap Package Type order by facilityID',
		description: `Facility Owner can use this API`,
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: UpdateOrderDto,
		examples: {
			Test1: {
				value: {
					order1: 0,
					order2: 1,
				} as UpdateOrderDto,
			},
			Test2: {
				value: {
					order1: 1,
					order2: 3,
				} as UpdateOrderDto,
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				message: 'Swap order successful!',
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
	async swapPackageTypeInList(
		@Param('facilityID') facilityID: string,
		@Body() data: UpdateOrderDto,
	) {
		return await this.facilityService.swapPackageTypeInList(facilityID, data);
	}

	@Patch(':facilityID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Modified facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: UpdateFacilityDto,
		examples: {
			example1: {
				value: {
					brandID: '1123456',
					facilityCategoryID: '1233',
					name: 'City gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'HIỆN ĐẠI BẬT NHẤT',
					coordinatesLocation: [45, 54],
					state: State.ACTIVE,
					scheduleType: ScheduleType.WEEKLY,
				} as UpdateFacilityDto,
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					coordinationLocation: [45, 54],
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					scheduleType: ScheduleType.WEEKLY,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updateFacility() {
		//
	}

	@Patch(':facilityID/photos')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update photo of facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		type: UpdatePhotoOfFacilityDto,
		examples: {
			example1: {
				value: {
					photos: [],
					deletedImages: ['name_image1', 'name_image2'],
				} as UpdatePhotoOfFacilityDto,
			},
		},
		// description: 'File and sample data',
		// schema: {
		// 	type: 'object',
		// 	properties: {
		// 		file: {
		// 			type: 'string',
		// 			format: 'binary',
		// 		},
		// 		data: {
		// 			type: 'string',
		// 		},
		// 	},
		// },
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					brandID: {},
					facilityCategoryID: {},
					ownerID: {},
					name: 'City Gym',
					address: {
						street: '30/4',
						commune: 'Phường Xuân Khánh',
						communeCode: '011',
						district: 'Quận Ninh Kiều',
						districtCode: '056',
						province: 'Thành phố Cần Thơ',
						provinceCode: '065',
					},
					averageStar: null,
					summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
					description: 'ABC',
					coordinationLocation: [45, 54],
					state: State.ACTIVE,
					status: Status.APPROVED,
					photos: [],
					reviews: [],
					scheduleType: ScheduleType.WEEKLY,
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	updatePhotoOfFacility() {
		//
	}
}
