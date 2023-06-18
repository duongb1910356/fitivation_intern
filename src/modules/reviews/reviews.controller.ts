import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
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
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review-dto';
import { Review } from './schemas/reviews.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Photo } from '../photo/schemas/photo.schema';
import { ReviewService } from './reviews.service';
import { Public } from '../auth/utils';
import { ListOptions } from 'src/shared/response/common-response';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post()
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiOperation({
		summary: 'Create a new review',
	})
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
				facilityID: {
					type: 'string',
				},
				rating: {
					type: 'string',
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
					_id: '648d850b1b2725a801b7e468',
					facilityID: '648d7e86669f8855b28f33d1',
					comment: 'Đáng để trải nghiệm',
					rating: 4,
					photos: [
						{
							_id: '648d850b1b2725a801b7e464',
							ownerID: '168699623474509rcare0nu0u',
							name: '1686996235092-645118712.png',
							imageURL:
								'http://localhost:8080/168699623474509rcare0nu0u/1686996235092-645118712.png',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					] as Photo[],
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	createReview(
		@Body() reviewDto: CreateReviewDto,
		@UploadedFiles()
		files: {
			images?: Express.Multer.File[];
		},
		@Req() req: any,
	) {
		return this.reviewService.createOne(files, req, reviewDto);
	}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many review',
	})
	findMany(@Query() filter: ListOptions<Review>) {
		return this.reviewService.findMany(filter);
	}

	// @Patch(':id')
	// @ApiBearerAuth()
	// @ApiOperation({
	// 	summary: 'Modified review',
	// })
	// @ApiParam({ name: 'id', type: String, description: 'Review ID' })
	// @ApiBody({
	// 	type: UpdateReviewDto,
	// 	examples: {
	// 		example1: {
	// 			value: {
	// 				rating: 5,
	// 				comment: 'string',
	// 				photos: [],
	// 				deletedImages: ['name-image1', 'name-image2'],
	// 			} as UpdateReviewDto,
	// 		},
	// 	},
	// })
	// @ApiOkResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			code: 200,
	// 			message: 'Success',
	// 			data: {
	// 				_id: '123456789',
	// 				accountID: {},
	// 				facilityID: {},
	// 				comment: 'Đáng để trải nghiệm',
	// 				rating: 5,
	// 				photos: [
	// 					{
	// 						_id: '12345678dsgdgsdxdg4',
	// 						ownerID: 'bucket1',
	// 						name: 'image-name',
	// 						imageURL: 'http://localhost:8080/bucket1/image-name',
	// 						createdAt: new Date(),
	// 						updatedAt: new Date(),
	// 					},
	// 				] as Photo[],
	// 				createdAt: new Date(),
	// 				updatedAt: new Date(),
	// 			} as Review,
	// 		},
	// 	},
	// })
	// @ApiBadRequestResponse({
	// 	type: BadRequestException,
	// 	status: 400,
	// 	description: '[Input] invalid!',
	// })
	// updateFacility() {
	// 	//
	// }

	@Delete(':reviewID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete Review by id',
	})
	@ApiParam({ name: 'reviewID', type: String, description: 'Review ID' })
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
	deleteReviewById(@Param('reviewID') reviewID: any) {
		return this.reviewService.deleteByID(reviewID);
	}
}
