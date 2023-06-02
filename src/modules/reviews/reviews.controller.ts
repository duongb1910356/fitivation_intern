import { BadRequestException, Controller, Delete, Get, NotFoundException, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/utils';
import { CreateReviewDto } from './dto/create-review-dto';
import { Review } from './schemas/reviews.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateReviewDto } from './dto/update-review-dto';
import { FileUploadDto } from '../photo/dto/file-upload-dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {

    @Post()
    @ApiOperation({
        summary: 'Create a new review'
    })
    @ApiBody({
        type: CreateReviewDto,
        examples: {
            example1: {
                value: {
                    accountID: '1233456',
                    facilityID: '123456',
                    rating: 5,
                    comment: 'Great',
                    photos: []
                } as CreateReviewDto,
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
                    accountID: '1233456',
                    facilityID: '123456',
                    rating: 5,
                    comment: 'Great',
                    linkURLs: [
                        'http://abc.xyz'
                    ]
                } as unknown as Review,
            },
        },
    })
    @ApiBadRequestResponse({
        type: BadRequestException,
        status: 400,
        description: '[Input] invalid!',
    })
    @UseInterceptors(FilesInterceptor('files', 5))
    createReview() {
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Modified review'
    })
    @ApiParam({ name: 'id', type: String, description: 'Review ID' })
    @ApiBody({
        type: UpdateReviewDto,
        examples: {
            example1: {
                value: {
                    rating: 5,
                    comment: 'string',
                    photos: [
                        {fileName: 'abc', file: null} as FileUploadDto
                    ],
                    deletedImages: [
                        'image1',
                        'image2',
                    ]
                } as UpdateReviewDto,
            }
        }
    })
    @ApiOkResponse({
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
    updateFacility() {

    }


    @Delete(':id')
    @ApiOperation({
        summary: 'Delete Review by id'
    })
    @ApiParam({ name: 'id', type: String, description: 'Review ID' })
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
        description: 'Review not found!',
    })
    deleteReviewById() {

    }
}