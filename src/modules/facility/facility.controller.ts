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
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/utils';
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
import { CreateFacilityScheduleDto } from '../facility-schedule/dto/create-facility-schedule-dto';
import { dayOfWeek } from '../facility-schedule/entities/open-time.entity';
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { UpdatePhotoOfFacilityDto } from './dto/update-photo-facility';
// import { FacilityService } from './facility.service';
import { CreateReviewDto } from '../reviews/dto/create-review-dto';
import { FacilityService } from './facility.service';

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

	// @ApiBearerAuth()
	// @Get(':facilityID/attendances')
	// @ApiOperation({
	//     summary: 'Get All Attendance by facilityID',
	//     description: `Owner can use this API`,
	// })
	// @ApiParam({
	//     name: 'facilityID',
	//     type: String,
	//     description: 'Facility ID',
	// })
	// @ApiDocsPagination('Attendance')
	// @ApiOkResponse({
	//     schema: {
	//         example: {
	//             items: [
	//                 {
	//                     _id: '6476ef7d1f0419cd330fe128',
	//                     facilityID: {} as unknown as Facility,
	//                     accountID: {} as unknown as User,
	//                     date: [],
	//                     createdAt: new Date(),
	//                     updatedAt: new Date(),
	//                 } as Attendance,
	//             ],
	//             total: 1,
	//             options: {
	//                 limit: 10,
	//                 offset: 0,
	//                 searchField: 'facilityID',
	//                 searchValue: 'string',
	//                 sortField: 'accountID',
	//                 sortOrder: 'asc',
	//             } as ListOptions<Attendance>,
	//         } as ListResponse<Attendance>,
	//     },
	// })
	// @ApiNotFoundResponse({
	//     schema: {
	//         example: {
	//             code: '404',
	//             message: 'Facility not found!',
	//             details: null,
	//         } as ErrorResponse<null>,
	//     },
	// })
	// @ApiBadRequestResponse({
	//     schema: {
	//         example: {
	//             code: '400',
	//             message: '[Input] invalid!',
	//             details: null,
	//         } as ErrorResponse<null>,
	//     },
	// })
	// @ApiUnauthorizedResponse({
	//     schema: {
	//         example: {
	//             code: '401',
	//             message: 'Unauthorized',
	//             details: null,
	//         } as ErrorResponse<null>,
	//     },
	// })
	// @ApiForbiddenResponse({
	//     schema: {
	//         example: {
	//             code: '403',
	//             message: 'Forbidden resource',
	//             details: null,
	//         } as ErrorResponse<null>,
	//     },
	// })
	// getAllAttendancesByFacility(
	//     @Param('facilityID') facilityID: string,
	//     @Query() filter: ListOptions<Attendance>,
	// ) {
	//     console.log(facilityID, filter);
	//     //
	// }
	@ApiBearerAuth()
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
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<FacilitySchedule>,
	) {
		console.log(facilityID, filter);
		//
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
	getCurrentScheduleByFacility(@Param('facilityID') facilityID: string) {
		console.log(facilityID);
		//
	}

	@Public()
	@Get(':facilityID/holidays')
	@ApiOperation({
		summary: 'Get All Holidays by facilityID',
		description: `All role can use this API`,
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
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<Holiday>,
	) {
		console.log(facilityID, filter);
		//
	}

	@Public()
	@Get(':facilityID/package-types')
	@ApiOperation({
		summary: 'Get all Package Type by facilityID',
		description: `All role can use this API`,
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
	getAllPackageTypeByFacility(
		@Param('facilityID') facilityID: string,
		@Query() filter: ListOptions<PackageType>,
	) {
		//
		console.log(facilityID, filter);
	}

	@ApiBearerAuth()
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
		@Param('facilityID') facilityID: string,
		@Body() data: CreateFacilityScheduleDto,
	) {
		console.log(facilityID, data);
		//
	}

	@ApiBearerAuth()
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
		@Param('facilityID') facilityID: string,
		@Body() data: HolidayDto,
	) {
		console.log(facilityID, data);
		//
	}

	@ApiBearerAuth()
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
	createPackageType(
		@Param('facilityID') id: string,
		@Body() data: CreatePackageTypeDto,
	) {
		console.log(id, data);
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
					coordinates: [45, 54],
					scheduleType: ScheduleType.WEEKLY,
					photos: [],
				} as unknown as CreateFacilityDto,
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
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	createFacility(
		@Body() createFacilityDto: CreateFacilityDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		console.log('USER: ', req.user);
		if (files != undefined) {
			return this.facilityService.createFacilityWithFile(
				createFacilityDto,
				req,
			);
		} else {
			return this.facilityService.createFacilityWithFile(
				createFacilityDto,
				req,
				files,
			);
		}
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
	swapPackageTypeInList(
		@Param('facilityID') facilityID: string,
		@Body() data: UpdateOrderDto,
	) {
		console.log(facilityID, data);
		//Logic để hoán đổi order của 2 TackageType
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
					state: State.ACTIVE,
					scheduleType: ScheduleType.WEEKLY,
				} as unknown as UpdateFacilityDto,
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

	@Patch(':facilityID/reviews')
	@ApiOperation({
		summary: 'Embedd newest review to facility',
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
	async updateReviewFacility(
		@Param('facilityID') facilityID,
		@Body() reviewDto: CreateReviewDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		return await this.facilityService.updateReviewFacility(
			facilityID,
			files,
			req,
			reviewDto,
		);
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
