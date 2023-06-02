import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
// import { ReviewsController } from '../reviews/reviews.controller';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateFacilityDto } from './dto/create-facility-dto';
import { Facility } from './schemas/facility.schema';
import { ListOptions, ListResponse } from 'src/shared/response/common-response.type';
import { Brand } from '../brand/schemas/brand.schema';
import { FacilityCategory } from '../facility-category/entities/facility-category';
import { User } from '../users/schemas/user.schema';
import { Review } from '../reviews/schemas/reviews.schema'
import { UpdateFacilityDto } from './dto/update-facility-dto';
import { FileUploadDto } from '../photo/dto/file-upload-dto';
enum State {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

enum Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

enum ScheduleType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

@ApiTags('facilitys')
@Controller('facilitys')
export class FacilityController {
    // constructor(private readonly ReviewsController: ReviewsController) { }

    @Public()
    @Get()
    @ApiOperation({
        summary: 'Get all facility'
    })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'search', required: false, type: String, example: 'Name of Brand' })
    @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'name' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc' })
    @ApiOkResponse({
        status: 200,
        schema: {
            example: {
                code: 200,
                message: 'Success',
                data: {
                    items: [
                        {
                            _id: '1233456',
                            brandID: '123456',
                            facilityCategoryID: '123456',
                            ownerID: '123456',
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
                                    _id: '123456',
                                    facilityID: '123456',
                                    linkURL: 'http://abc.xyz',
                                    describe: 'String',
                                    createAt: 'Date',
                                    updateAt: 'Date'
                                }
                            ],
                            reviews: [
                                {
                                    _id: '123',
                                    accountID: '12345',
                                    facilityID: '123456789',
                                    rating: 5,
                                    comment: 'Comment',
                                    linkURLs: [
                                        'http://abc1.xyz',
                                        'http://abc2.xyz',
                                    ]
                                }
                            ],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        } as unknown as Facility
                    ],
                    total: 1,
                    options: {
                        limit: 1,
                        offet: 1,
                        search: 'string',
                        sortBy: 'createdAt',
                        sortOrder: 'asc'
                    } as ListOptions
                } as ListResponse<Facility>,
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
    getAllFacility() {
    }


    @Post()
    @ApiOperation({
        summary: 'Create a new facility'
    })
    @ApiBody({
        type: CreateFacilityDto,
        examples: {
            example1: {
                value: {
                    brandID: '1123456',
                    facilityCategoryID: '1233',
                    ownerID: 'optional',
                    name: 'City gym',
                    address: 'Object ID của Commune',
                    summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
                    description: 'HIỆN ĐẠI BẬT NHẤT',
                    coordinatesLocation: [45, 54],
                    // state: State.ACTIVE,
                    // status: Status.APPROVED,
                    scheduleType: ScheduleType.WEEKLY,
                    photos: [
                        {file: null} 
                    ],
                } as CreateFacilityDto,
            }
        }
    })
    
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({
        status: 200,
        schema: {
            example: {
                code: 200,
                message: 'Success',
                data: {
                    brandID: '123456',
                    facilityCategoryID: '123456',
                    ownerID: '123456',
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
                    summary: 'CHẤT LƯỢNG LÀ DANH DỰ',
                    description: 'ABC',
                    coordinationLocation: [45, 54],
                    state: State.ACTIVE,
                    status: Status.APPROVED,
                    averageStar: null,
                    photos: [
                        {
                            _id: '123456',
                            targetID: '123456',
                            linkURL: 'http://abc.xyz',
                            describe: 'String',
                            createAt: 'Date',
                            updateAt: 'Date'
                        }
                    ],
                    reviews: [],
                    scheduleType: ScheduleType.WEEKLY,
                    createdAt: 'Date',
                    updatedAt: 'Date'
                } as unknown as Facility,
            },
        },
    })
    @ApiBadRequestResponse({
        type: BadRequestException,
        status: 400,
        description: '[Input] invalid!',
    })
    @UseInterceptors(FilesInterceptor('files', 1))
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
                        {fileName: 'abc', file: null} as FileUploadDto
                    ],
                    deletedImages: [
                        'image1',
                        'image2',
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
                    ownerID: '123456',
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


