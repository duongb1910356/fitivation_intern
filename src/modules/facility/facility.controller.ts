import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
// import { ReviewsController } from '../reviews/reviews.controller';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { Facility } from './schemas/facility.schema';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Brand } from '../brand/schemas/brand.schema';
import { FacilityCategory } from '../facility-category/entities/facility-category';
import { User } from '../users/schemas/user.schema';
import { Review } from '../reviews/schemas/reviews.schema'
import { UpdateFacilityDto } from './dto/update-facility-dto';
import { FileUploadDto } from '../photo/dto/file-upload-dto';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Photo } from '../photo/schemas/photo.schema';
import { State, Status, ScheduleType } from '../../shared/enum/facility.enum';

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
                            province: {
                                name: 'TP Cần Thơ',
                                code: 65
                            },
                            district: {
                                name: 'Phường Xuân Khánh',
                                code: 56
                            },
                            commune: {
                                name: 'Quận Ninh Kiều',
                                code: 11
                            }
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
                                buckets: 'id-bucket',
                                name: 'name-image',
                                linkURL: 'http://localhost:8080/id-bucket/name-image',
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
                                        buckets: 'bucket1',
                                        name: 'image-name',
                                        linkURL: 'http://localhost:8080/bucket1/image-name',
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
                province: {
                    name: 'TP Cần Thơ',
                    code: 65
                },
                district: {
                    name: 'Phường Xuân Khánh',
                    code: 56
                },
                commune: {
                    name: 'Quận Ninh Kiều',
                    code: 11
                }
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
                    buckets: 'id-bucket',
                    name: 'name-image',
                    linkURL: 'http://localhost:8080/id-bucket/name-image',
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
                            buckets: 'bucket1',
                            name: 'image-name',
                            linkURL: 'http://localhost:8080/bucket1/image-name',
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
                                    buckets: 'bucket1',
                                    name: 'image-name',
                                    linkURL: 'http://localhost:8080/bucket1/image-name',
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
                                province: {
                                    name: 'TP Cần Thơ',
                                    code: 65
                                },
                                district: {
                                    name: 'Phường Xuân Khánh',
                                    code: 56
                                },
                                commune: {
                                    name: 'Quận Ninh Kiều',
                                    code: 11
                                }
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
                            buckets: 'id-bucket',
                            name: 'name-image',
                            linkURL: 'http://localhost:8080/id-bucket/name-image',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ],
                    options: {
                        limit: 1,
                        offset: 1,
                        searchField: 'buckets',
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


    @Post()
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
                    address: 65,
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
                        province: {
                            name: 'TP Cần Thơ',
                            code: 65
                        },
                        district: {
                            name: 'Phường Xuân Khánh',
                            code: 56
                        },
                        commune: {
                            name: 'Quận Ninh Kiều',
                            code: 11
                        }
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

    @Patch(':id')
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
                    ownerID: 'sdsgs4',
                    name: 'City gym',
                    address: 'Object ID của Commune',
                    summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
                    description: 'HIỆN ĐẠI BẬT NHẤT',
                    coordinatesLocation: [45, 54],
                    state: State.ACTIVE,
                    status: Status.APPROVED,
                    photos: [
                        { fileName: 'abc', file: null } as FileUploadDto
                    ],
                    deletedImages: [
                        'name-image1',
                        'name-image2',
                    ],
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
                    brandID: '123456',
                    facilityCategoryID: '123456',
                    // ownerID: '123456',
                    name: 'City Gym',
                    address: {
                        province: {
                            name: 'TP Cần Thơ',
                            code: 65
                        },
                        district: {
                            name: 'Phường Xuân Khánh',
                            code: 56
                        },
                        commune: {
                            name: 'Quận Ninh Kiều',
                            code: 11
                        }
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
                } as unknown as Facility,
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

}


