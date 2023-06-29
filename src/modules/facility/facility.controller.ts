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
	UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import { dayOfWeek } from '../facility-schedule/entities/open-time.entity';
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { DeletePhotoOfFacilityDto } from './dto/delete-photo-facility';
// import { FacilityService } from './facility.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';
import { FacilityService } from './facility.service';
import { DeleteReviewOfFacilityDto } from './dto/delete-review-facility';
import { Public } from '../auth/decorators/public.decorator';
import { OwnershipFacilityGuard } from 'src/guards/ownership/ownership-facility.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { User, UserRole } from '../users/schemas/user.schema';
import { Attendance } from '../attendance/entities/attendance.entity';
import { UpdateStatusFacilityDto } from './dto/update-status-facility';
import { CreatePromotionDto } from '../promotions/dto/create-promotion-dto';
import {
	CustomerType,
	Promotion,
	PromotionMethod,
	PromotionStatus,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion-dto';
import { FacilityScheduleDto } from '../facility-schedule/dto/facility-schedule-dto';

@ApiTags('facilities')
@Controller('facilities')
export class FacilityController {
	constructor(private readonly facilityService: FacilityService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many facility with many fields',
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
						coordinates: [65, 56],
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
	async getManyFacility(@Query() filter: ListOptions<Facility>) {
		return await this.facilityService.findMany(filter);
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
			coordinates: [65, 56],
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
	async getFacilityById(@Param('facilityID') facilityID) {
		return await this.facilityService.findOneByID(facilityID);
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
	getReviewFacility(
		@Param('facilityID') facilityID,
		@Query() filter: ListOptions<Review>,
	) {
		return this.facilityService.findManyReviews(facilityID, filter);
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
							coordinates: [65, 56],
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
	getPhotoFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<Photo>,
	) {
		return this.facilityService.findManyPhotos(facilityID, filter);
		// return this.pho;
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
		return await this.facilityService.getAttendance(facilityID, req.user.sub);
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
			req.user.sub,
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
									endTime: '12:00',
								},
								{
									startTime: '13:00',
									endTime: '19:00',
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
									endTime: '12:00',
								},
								{
									startTime: '13:00',
									endTime: '19:00',
								},
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.MONDAY,
						},
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
							] as ShiftTimeDto[],
							dayOfWeek: dayOfWeek.TUESDAY,
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
									endTime: '12:00',
								},
								{
									startTime: '13:00',
									endTime: '19:00',
								},
							] as ShiftTimeDto[],
							dayOfMonth: 1,
						},
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
							] as ShiftTimeDto[],
							dayOfMonth: 2,
						},
					] as OpenTimeDto[],
				} as FacilityScheduleDto,
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
								startTime: '06:00',
								endTime: '12:00',
							},
							{
								startTime: '13:00',
								endTime: '19:00',
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
		@Body() data: FacilityScheduleDto,
	) {
		return await this.facilityService.createSchedule(facilityID, data);
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
		// type: CreateFacilityDto,
		// examples: {
		// 	example1: {
		// 		value: {
		// 			brandID: '64951fa2d6fe6b9d23357331',
		// 			facilityCategoryID: '64951fa2d6fe6b9d23357331',
		// 			name: 'City gym',
		// 			address: {
		// 				street: '30/4',
		// 				province: 'Thành phố Cần Thơ',
		// 				provinceCode: '065',
		// 				district: 'Quận Ninh Kiều',
		// 				districtCode: '066',
		// 				commune: 'Phường Xuân Khánh',
		// 				communeCode: '067',
		// 			},
		// 			summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
		// 			description: 'HIỆN ĐẠI BẬT NHẤT',
		// 			coordinates: [45, 54],
		// 			scheduleType: ScheduleType.WEEKLY,
		// 			photos: [],
		// 		} as CreateFacilityDto,
		// 	},
		// },
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
				},
				brandID: { type: 'string' },
				facilityCategoryID: { type: 'string' },
				name: { type: 'string' },
				address: {
					type: 'object',
					properties: {
						street: { type: 'string' },
						province: { type: 'string' },
						provinceCode: { type: 'string' },
						district: { type: 'string' },
						districtCode: { type: 'string' },
						commune: { type: 'string' },
						communeCode: { type: 'string' },
					},
				},
				summary: { type: 'string' },
				description: { type: 'string' },
				coordinates: {
					type: 'array',
					items: {
						type: 'number',
						format: 'number',
					},
				},
				scheduleType: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY'] },
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
					coordinates: [65, 56],
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
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	createFacility(
		@Body() createFacilityDto: CreateFacilityDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		return this.facilityService.create(
			createFacilityDto,
			req,
			files || undefined,
		);
	}

	@Delete(':facilityID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete Facility by facilityID',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
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
	deleteFacilityById(@Param('facilityID') facilityID, @Req() req: any) {
		return this.facilityService.delete(facilityID, req);
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
					coordinates: [45, 54],
					scheduleType: ScheduleType.WEEKLY,
					state: State.ACTIVE,
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
					coordinates: [45, 54],
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
	updateFacility(
		@Param('facilityID') facilityID,
		@Body() body: UpdateFacilityDto,
		@Req() req: any,
	) {
		return this.facilityService.update(facilityID, body, req);
	}

	@Patch(':facilityID/status')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update status facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		type: UpdateFacilityDto,
		examples: {
			example1: {
				value: {
					status: Status.APPROVED,
				},
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
					coordinates: [45, 54],
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
	updateStatus(
		@Param('facilityID') facilityID,
		@Body() body: UpdateStatusFacilityDto,
		@Req() req: any,
	) {
		return this.facilityService.updateStatus(facilityID, req, body.status);
	}

	@Patch(':facilityID/reviews/add')
	@ApiOperation({
		summary: 'Add the newest reviews to the facility',
	})
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
						description: 'accept: jpeg|png',
					},
				},
				rating: {
					type: 'number',
				},
				comment: {
					type: 'string',
				},
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
					reviews: [
						{
							accountID: '6475692ce552996bd0014c94',
							facilityID: '649011312a7e17d72b9d724b',
							rating: 4,
							comment:
								'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
							photos: [
								{
									createdAt: '2023-06-19T08:36:43.955Z',
									updatedAt: '2023-06-19T08:36:43.955Z',
									ownerID: '16871638035675p6zo2e5x3j',
									name: '1687163803571-508394429.jpeg',
									__id: '6490139b2a7e17d72b9d725e',
									imageURL:
										'http://localhost:8080/16871638035675p6zo2e5x3j/1687163803571-508394429.jpeg',
								},
							],
						},
					],
					createdAt: new Date(),
					updatedAt: new Date(),
				} as unknown as Facility,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	async addReviewFacility(
		@Param('facilityID') facilityID,
		@Body() reviewDto: CreateReviewDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		return await this.facilityService.addReview(
			facilityID,
			req,
			reviewDto,
			files || null,
		);
	}

	@Patch(':facilityID/photos/add')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Add the newest photos to the facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
						description: 'accept: jpeg|png',
					},
				},
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
					coordinates: [45, 54],
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
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	async addPhotoFacility(
		@Param('facilityID') facilityID,
		@Req() req: any,
		@UploadedFiles()
		files: {
			images: Express.Multer.File[];
		},
	) {
		return await this.facilityService.addPhoto(facilityID, req, files);
	}

	@Patch(':facilityID/photos/delete')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete photos of facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		description: 'listDeleteID is array _id of image which you want to deleted',
		schema: {
			type: 'object',
			properties: {
				listDeleteID: {
					type: 'array',
					items: {
						type: 'string',
						format: 'ObjectId',
					},
				},
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
					coordinates: [45, 54],
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
	async deletePhotoFacility(
		@Param('facilityID') facilityID,
		@Req() req: any,
		@Body() body: DeletePhotoOfFacilityDto,
	) {
		return await this.facilityService.deletePhoto(
			facilityID,
			req,
			body.listDeleteID,
		);
	}

	@Patch(':facilityID/reviews/delete')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete reviews of facility',
	})
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
	@ApiBody({
		description:
			'listDeleteID is array _id of reivew which you want to deleted',
		schema: {
			type: 'object',
			properties: {
				listDeleteID: {
					type: 'array',
					items: {
						type: 'string',
						format: 'ObjectId',
					},
				},
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
					coordinates: [45, 54],
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
	async deleteReviewFacility(
		@Param('facilityID') facilityID,
		@Req() req: any,
		@Body() body: DeleteReviewOfFacilityDto,
	) {
		return await this.facilityService.deleteReview(
			facilityID,
			req,
			body.listDeleteID,
		);
	}

	@ApiBearerAuth()
	@UseGuards(OwnershipFacilityGuard)
	@Post(':facilityID/promotions')
	@ApiOperation({
		summary: 'Create facility promotion',
	})
	@ApiBearerAuth()
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility id' })
	@ApiBody({
		type: CreatePromotionDto,
		examples: {
			test1: {
				value: {
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
				} as CreatePromotionDto,
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
					targetID: '6498f23e20d189a6b1607c7e',
					type: 'FACILITY',
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createPromotion(
		@Param('facilityID') id: string,
		@Body() body: CreatePromotionDto,
	) {
		return this.facilityService.createPromotion(id, body);
	}

	@Public()
	@Get(':facilityID/promotions')
	@ApiParam({ name: 'facilityID', type: String, description: 'Facility id' })
	@ApiOperation({
		summary: 'Get many facility promotion',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: 'string',
					targetID: '6498f23e20d189a6b1607c7e',
					type: 'FACILITY',
					name: 'Mừng hè đi tập gym nè',
					description: 'Chính sách mô tả',
					couponCode: '066',
					value: 10,
					method: 'PERCENT',
					minPriceApply: 0,
					maxValue: 10000,
					maxQuantity: 45,
					startDate: new Date(),
					endDate: new Date(),
					customerType: 'MEMBER',
					status: 'ACTIVE',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Promotion,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findManyPromotion(@Param('facilityID') facilityID: string) {
		return this.facilityService.findManyPromotion(facilityID);
	}

	@ApiBearerAuth()
	@Patch('promotion/:promotionID')
	@ApiOperation({
		summary: 'update Facility Promotion',
		description: 'Allow facility owner to update facility promotion',
	})
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiBody({
		type: UpdatePromotionDto,
		examples: {
			Facility_Promotion: {
				value: {
					name: 'string',
					description: 'string',
					couponCode: 'string',
					value: 1,
					method: PromotionMethod.NUMBER,
					minPriceApply: 1,
					maxValue: 1,
					maxQuantity: 1,
					endDate: new Date(),
					customerType: CustomerType.CUSTOMER,
					status: PromotionStatus.ACTIVE,
				} as UpdatePromotionDto,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				targetID: {},
				type: PromotionType.BILL,
				name: 'string',
				description: 'string',
				couponCode: 'string',
				value: 1,
				method: PromotionMethod.NUMBER,
				minPriceApply: 1,
				maxValue: 1,
				maxQuantity: 1,
				startDate: new Date(),
				endDate: new Date(),
				customerType: CustomerType.CUSTOMER,
				status: PromotionStatus.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as Promotion,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Bad request',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	async updatePromotion(
		@Param('promotionID') promotionID: string,
		@Body() body: UpdatePromotionDto,
		@Req() req: any,
	) {
		return await this.facilityService.updatePromotion(promotionID, body, req);
	}

	@ApiBearerAuth()
	@Delete('promotion/:promotionID')
	@ApiOperation({
		summary: 'delete Facility Promotion',
		description: 'Allow facility owner to delete facility promotion',
	})
	@ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: '200',
				message: 'Deleted successfully',
				details: null,
			},
		},
	})
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found document with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	deletePromotion(@Param('promotionID') promotionID: string, @Req() req: any) {
		return this.facilityService.deletePromotion(promotionID, req);
	}
}
