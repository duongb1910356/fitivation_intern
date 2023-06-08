import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
// import { ReviewsController } from '../reviews/reviews.controller';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { Facility } from './schemas/facility.schema';
import { ErrorResponse, ListOptions, ListResponse } from 'src/shared/response/common-response';
import { UserRole } from '../users/schemas/user.schema';
import { Review } from '../reviews/schemas/reviews.schema'
import { UpdateFacilityDto } from './dto/update-facility-dto';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Photo } from '../photo/schemas/photo.schema';
import { State, Status, ScheduleType } from '../../shared/enum/facility.enum';
import { Roles } from 'src/decorators/role-decorator/role.decorator';
import { RolesGuard } from 'src/decorators/role-decorator/role.guard';
import { ShiftTime } from '../facility-schedule/entities/shift-time.entity';
import { OpenTime } from '../facility-schedule/entities/open-time.entity';
import { FacilitySchedule } from '../facility-schedule/entities/facility-schedule.entity';
import { Holiday } from '../holiday/entities/holiday.entity';
import { PackageType } from '../package-type/entities/package-type.entity';
import { ShiftTimeDto } from '../facility-schedule/dto/shift-time-dto';
import { OpenTimeDto } from '../facility-schedule/dto/open-time-dto';
import { CreateFacilityScheduleDto } from '../facility-schedule/dto/create-facility-schedule-dto';
import { dayOfWeek } from '../facility-schedule/entities/open-time.entity'
import { HolidayDto } from '../holiday/dto/holiday-dto';
import { CreatePackageTypeDto } from '../package-type/dto/create-package-type-dto';
import { UpdateOrderDto } from '../package-type/dto/update-order-dto';
import { UpdatePhotoOfFacilityDto } from './dto/update-photo-facility';
import { CustomerType, Promotion, PromotionMethod, PromotionStatus, PromotionType } from '../promotions/schemas/promotion.schema';
import { CreatePromotionDto } from '../promotions/dto/create-promotion.dto';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion.dto';

@ApiTags('facilities')
@Controller('facilities')
export class FacilityController {
    // constructor(private readonly ReviewsController: ReviewsController) { }

    @Public()
    @Get()
    @ApiOperation({
        summary: 'Search facility'
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
                            provinceCode: '065'
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
                                updatedAt: new Date()
                            }
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
                                        updatedAt: new Date()
                                    }
                                ] as Photo[],
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        ],
                        scheduleType: ScheduleType.DAILY,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    } as Facility
                ],
                total: 1,
                options: {
                    limit: 1,
                    offet: 1,
                    search: 'string',
                    sortBy: 'createdAt',
                    sortOrder: 'asc'
                } as ListOptions<Facility>
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
        description: '[Input] invalid'
    })
    getAllFacility() {
    }

    @Public()
    @Get(':id')
    @ApiParam({ name: 'id', type: String, description: 'Facility ID' })
    @ApiOperation({
        summary: 'Get facility by id'
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
                provinceCode: '065'
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
                    updatedAt: new Date()
                }
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
                            updatedAt: new Date()
                        }
                    ] as Photo[],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        } as Facility
    })
    @ApiNotFoundResponse({
        type: NotFoundException,
        status: 404,
        description: 'Facility not found!',
    })
    @ApiBadRequestResponse({
        type: BadRequestException,
        status: 400,
        description: '[Input] invalid'
    })
    getFacilityById() {
    }

    @Public()
    @Get(':id/reviews')
    @ApiParam({ name: 'id', type: String, description: 'Facility ID' })
    @ApiOperation({
        summary: 'Get review of facility by facilityID'
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
                                    updatedAt: new Date()
                                }
                            ] as Photo[],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ],
                    options: {
                        limit: 1,
                        offet: 1,
                        search: 'string',
                        sortBy: 'createdAt',
                        sortOrder: 'asc'
                    } as ListOptions<Review>
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
        description: '[Input] invalid'
    })
    getReviewOfFacility() {
    }

    @Public()
    @Get('nearby/:latitude/:longitude')
    @ApiParam({ name: 'latitude', type: Number, description: 'latitude' })
    @ApiParam({ name: 'longitude', type: Number, description: 'longitude' })
    @ApiOperation({
        summary: 'Find the nearest facilites'
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
                                provinceCode: '065'
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
                            updatedAt: new Date()
                        }
                    ],
                    options: {
                        limit: 1,
                        offet: 1,
                        search: 'string',
                        sortBy: 'averageStar',
                        sortOrder: 'asc'
                    } as ListOptions<Facility>
                } as ListResponse<Facility>,
            },
        },
    })
    @ApiBadRequestResponse({
        type: BadRequestException,
        status: 400,
        description: '[Input] invalid'
    })
    getFacilityByLocation() {
    }

    @Public()
    @Get(':id/photos')
    @ApiParam({ name: 'id', type: String, description: 'id facility' })
    @ApiOperation({
        summary: 'Get photos of facility'
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
                            updatedAt: new Date()
                        }
                    ],
                    options: {
                        limit: 1,
                        offset: 1,
                        searchField: 'ownerID',
                        searchValue: 'id-bucket',
                        sortField: 'createdAt',
                        sortOrder: 'asc',
                    } as ListOptions<Photo>
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
        description: '[Input] invalid'
    })
    getPhotoFacility() {
    }

    // @ApiBearerAuth()
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
    // @Get(':facilityId/attendances')
    // @ApiOperation({
    //     summary: 'Get All Attendance by facilityId',
    //     description: `Owner can use this API`,
    // })
    // @ApiParam({
    //     name: 'facilityId',
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
    //     @Param('facilityId') facilityId: string,
    //     @Query() filter: ListOptions<Attendance>,
    // ) {
    //     console.log(facilityId, filter);
    //     //
    // }


    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
    @Get(':facilityId/schedules')
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
    @Get(':facilityId/schedules/current')
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

    @Public()
    @Get(':facilityId/holidays')
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

    @Public()
    @Get(':facilityId/package-types')
    @ApiOperation({
        summary: 'Get all Package Type by facilityId',
        description: `All role can use this API`,
    })
    @ApiDocsPagination('PackageType')
    @ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
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
        @Param('facilityId') facilityId: string,
        @Query() filter: ListOptions<PackageType>,
    ) {
        //
        console.log(facilityId, filter);
    }

    @Get('promotions')
    @ApiTags('facilities/promotions')
    @ApiDocsPagination('promotion')
    @ApiOperation({
        summary: 'getManyFacilityPromotionsOfAllOwnFacilities',
        description:
            'Allow facility owner to get many facilities promotions of all own facilities',
    })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                items: [
                    {
                        targetID: 'string',
                        type: PromotionType.FACILITY,
                        name: 'string',
                        description: 'string',
                        couponCode: 'string',
                        value: 1,
                        method: PromotionMethod.NUMBER,
                        minPriceApply: 0,
                        maxQuantity: 0,
                        startDate: new Date(),
                        endDate: new Date(),
                        customerType: CustomerType.CUSTOMER,
                        status: PromotionStatus.ACTIVE,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ] as Promotion[],
                total: 1,
                options: {
                    limit: 1,
                    offset: 0,
                    searchField: {},
                    searchValue: '',
                    sortField: 'createdAt',
                    sortOrder: 'asc',
                } as ListOptions<Promotion>,
            } as ListResponse<Promotion>,
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
    getManyFacilityPromotionsOfAllOwnFacilities(
        @Query() filter: ListOptions<Promotion>,
    ) {
        return 'getManyFacilityPromotionsOfAllOwnFacilities';
    }

    @Get(':facilityID/promotions')
    @ApiTags('facilities/promotions')
    @ApiDocsPagination('promotion')
    @ApiOperation({
        summary: 'getManyFacilityPromotionsOfOneFacility',
        description:
            'Allow facility owner to get many facility promotions of one own facility\n\nAllow customer/admin to get many facility promotions of one facility',
    })
    @ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                items: [
                    {
                        targetID: 'string',
                        type: PromotionType.FACILITY,
                        name: 'string',
                        description: 'string',
                        couponCode: 'string',
                        value: 1,
                        method: PromotionMethod.NUMBER,
                        minPriceApply: 0,
                        maxQuantity: 0,
                        startDate: new Date(),
                        endDate: new Date(),
                        customerType: CustomerType.CUSTOMER,
                        status: PromotionStatus.ACTIVE,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ] as Promotion[],
                total: 1,
                options: {
                    limit: 1,
                    offset: 0,
                    searchField: {},
                    searchValue: '',
                    sortField: 'createdAt',
                    sortOrder: 'asc',
                } as ListOptions<Promotion>,
            } as ListResponse<Promotion>,
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
    getManyFacilityPromotionsOfOneFacility(
        @Param('facilityID') facilityID: string,
        @Query() filter: ListOptions<Promotion>,
    ) {
        return 'getManyFacilityPromotionsOfOneFacility';
    }

    @Get(':facilityID/promotions')
    @ApiTags('facilities/promotions')
    @ApiDocsPagination('promotion')
    @ApiOperation({
        summary: 'getPromotionByOwnerFacility',
        description:
            'Allow facility owner to get many promotions of own facility\n\nAllow customer/admin to get many promotions of one facility',
    })
    @ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                items: [
                    {
                        targetID: 'string',
                        type: PromotionType.BILL,
                        name: 'string',
                        description: 'string',
                        couponCode: 'string',
                        value: 1,
                        method: PromotionMethod.NUMBER,
                        minPriceApply: 0,
                        maxQuantity: 0,
                        startDate: new Date(),
                        endDate: new Date(),
                        customerType: CustomerType.CUSTOMER,
                        status: PromotionStatus.ACTIVE,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ] as Promotion[],
                total: 1,
                options: {
                    limit: 1,
                    offset: 0,
                    searchField: {},
                    searchValue: '',
                    sortField: 'createdAt',
                    sortOrder: 'asc',
                } as ListOptions<Promotion>,
            } as ListResponse<Promotion>,
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
    getPromotionByOwnerFacility(
        @Param('facilityID') facilityID: string,
        @Query() filter: ListOptions<Promotion>,
    ) {
        return 'getPromotionByOwnerFacility';
    }

    @Post(':facilityID/promotions')
    @ApiTags('facilities/promotions')
    @ApiOperation({
        summary: 'createFacilityPromotion',
        description:
            'Allow facility owner to create one facility promotions of one own facility',
    })
    @ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
    @ApiBody({
        type: CreatePromotionDto,
        examples: {
            ADMIN: {
                value: {
                    targetID: 'string',
                    type: PromotionType.FACILITY,
                    name: 'string',
                    description: 'string',
                    couponCode: 'string',
                    value: 1,
                    method: PromotionMethod.NUMBER,
                    minPriceApply: 0,
                    maxQuantity: 0,
                    startDate: new Date(),
                    endDate: new Date(),
                    customerType: CustomerType.CUSTOMER,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        schema: {
            example: {
                targetID: 'string',
                type: PromotionType.FACILITY,
                name: 'string',
                description: 'string',
                couponCode: 'string',
                value: 1,
                method: PromotionMethod.NUMBER,
                minPriceApply: 0,
                maxQuantity: 0,
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
    createFacilityPromotion() {
        return 'createFacilityPromotion';
    }

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
    @Post(':facilityId/schedules')
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
        type: CreateFacilityDto,
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
    @Post(':facilityId/holidays')
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
    @Post(':facilityId/package-types')
    @ApiOperation({
        summary: 'Create new Package Type by facilityId',
        description: `Facility Owner can use this API`,
    })
    @ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
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
        @Param('facilityId') id: string,
        @Body() data: CreatePackageTypeDto,
    ) {
        console.log(id, data);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create a new facility'
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
                        communeCode: 'string'
                    },
                    summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
                    description: 'HIỆN ĐẠI BẬT NHẤT',
                    coordinatesLocation: [45, 54],
                    scheduleType: ScheduleType.WEEKLY,
                    photos: [
                        { file: null }
                    ],
                } as CreateFacilityDto,
            }
        }
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
                        provinceCode: '065'
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
                    updatedAt: new Date()
                } as Facility
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
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete Facility by id'
    })
    @ApiParam({ name: 'id', type: String, description: 'Facility ID' })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                code: 200,
                message: 'Success',
                data: null
            }
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

    }

    @Delete('facilities/:facilityID/promotions/:promotionID')
    @ApiTags('facilities/promotions')
    @ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
    @ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
    @ApiOperation({
        summary: 'deleteFacilityPromotion',
        description:
            'Allow facility owner to delete one facility promotion of one own facility',
    })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                code: 200,
                message: 'Deleted successfully',
            },
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
    deleteFacilityPromotion(
        @Param('facilityID') packageID: string,
        @Param('promotionID') promotionID: string,
    ) {
        return 'deleteFacilityPromotion';
    }

    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER)
    @Patch(':facilityId/package-types/swap-order')
    @ApiOperation({
        summary: 'Swap Package Type order by facilityId',
        description: `Facility Owner can use this API`,
    })
    @ApiParam({ name: 'facilityId', type: String, description: 'Facility ID' })
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
        @Param('facilityId') facilityId: string,
        @Body() data: UpdateOrderDto,
    ) {
        console.log(facilityId, data);
        //Logic để hoán đổi order của 2 TackageType
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Modified facility'
    })
    @ApiParam({ name: 'id', type: String, description: 'Facility ID' })
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
                        provinceCode: '065'
                    },
                    summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
                    description: 'HIỆN ĐẠI BẬT NHẤT',
                    coordinatesLocation: [45, 54],
                    state: State.ACTIVE,
                    scheduleType: ScheduleType.WEEKLY,
                } as UpdateFacilityDto,
            }
        }
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
                        provinceCode: '065'
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
                    updatedAt: new Date()
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

    }

    @Patch(':id/photos')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Update photo of facility'
    })
    @ApiParam({ name: 'id', type: String, description: 'Facility ID' })
    @ApiBody({
        type: UpdatePhotoOfFacilityDto,
        examples: {
            example1: {
                value: {
                    photos: [
                        { file: null, describe: 'tuỳ chọn có cũng được' }
                    ],
                    deletedImages: [
                        'name_image1',
                        'name_image2'
                    ]
                } as UpdatePhotoOfFacilityDto,
            }
        }
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
                        provinceCode: '065'
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
                    updatedAt: new Date()
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
    }

    @Patch(':facilityID/promotions/:promotionID')
    @ApiTags('facilities/promotions')
    @ApiOperation({
        summary: 'updateFacilityPromotion',
        description:
            'Allow facility owner to update one facility promotion of one own facility',
    })
    @ApiParam({ name: 'facilityID', type: String, description: 'Facility ID' })
    @ApiParam({ name: 'promotionID', type: String, description: 'Promotion ID' })
    @ApiBody({
        type: CreatePromotionDto,
        examples: {
            ADMIN: {
                value: {
                    targetID: 'string',
                    type: PromotionType.FACILITY,
                    name: 'string',
                    description: 'string',
                    couponCode: 'string',
                    value: 1,
                    method: PromotionMethod.NUMBER,
                    minPriceApply: 0,
                    maxQuantity: 0,
                    startDate: new Date(),
                    endDate: new Date(),
                    customerType: CustomerType.CUSTOMER,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        schema: {
            example: {
                targetID: 'string',
                type: PromotionType.FACILITY,
                name: 'string',
                description: 'string',
                couponCode: 'string',
                value: 1,
                method: PromotionMethod.NUMBER,
                minPriceApply: 0,
                maxQuantity: 0,
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
    updateFacilityPromotion(
        @Param('facilityID') facilityID: string,
        @Param('promotionID') promotionID: string,
        @Body() updatePromotionDto: UpdatePromotionDto,
    ) {
        return 'updateFacilityPromotion';
    }
}