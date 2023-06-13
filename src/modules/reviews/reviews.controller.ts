import {
	BadRequestException,
	Controller,
	Delete,
	NotFoundException,
	Patch,
	Post,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review-dto';
import { Review } from './schemas/reviews.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateReviewDto } from './dto/update-review-dto';
import { Photo } from '../photo/schemas/photo.schema';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
	@Post()
	@ApiBearerAuth()
	@UseInterceptors(FilesInterceptor('files', 5))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		summary: 'Create a new review',
	})
	@ApiBody({
		type: CreateReviewDto,
		examples: {
			example1: {
				value: {
					facilityID: '123456',
					rating: 5,
					comment: 'Great',
					photos: [
						{ file: {}, describe: 'optional' },
						{ file: {}, describe: 'optional' },
					],
				} as CreateReviewDto,
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
					_id: '123456789',
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
				} as Review,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createReview() {
		//
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Modified review',
	})
	@ApiParam({ name: 'id', type: String, description: 'Review ID' })
	@ApiBody({
		type: UpdateReviewDto,
		examples: {
			example1: {
				value: {
					rating: 5,
					comment: 'string',
					photos: [{ file: {}, describe: 'describe field is optional' }],
					deletedImages: ['name-image1', 'name-image2'],
				} as UpdateReviewDto,
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
				} as Review,
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

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete Review by id',
	})
	@ApiParam({ name: 'id', type: String, description: 'Review ID' })
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
		description: 'Review not found!',
	})
	deleteReviewById() {
		//
	}
}
