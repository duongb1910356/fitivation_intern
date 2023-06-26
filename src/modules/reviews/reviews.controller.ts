import { Controller, Get, Param, Query } from '@nestjs/common';
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ReviewService } from './reviews.service';
import { Review } from './schemas/reviews.schema';
import { ListOptions } from 'src/shared/response/common-response';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewService: ReviewService) {}

	/* 2 API NÀY TẠM THỜI KHÔNG CẦN THIẾT
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
						description: 'accept: jpeg|png',
					},
				},
				facilityID: {
					type: 'string',
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
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
	async createReview(
		@Body() reviewDto: CreateReviewDto,
		@Req() req: any,
		@UploadedFiles()
		files?: {
			images?: Express.Multer.File[];
		},
	) {
		console.log('review photo >> ', files);
		return await this.reviewService.create(req, reviewDto, files || undefined);
	}

	@Delete(':reviewID')
	@ApiBearerAuth()
	@ApiOperation({
		summary: '(NOTE: API NÀY TẠM THỜI KHÔNG DÙNG) Delete Review by id',
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
		return this.reviewService.delete(reviewID);
	}
	*/

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many review',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				items: [
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
				total: 1,
				options: {},
			},
		},
	})
	@ApiDocsPagination('ReviewSchema')
	findMany(@Query() filter: ListOptions<Review>) {
		return this.reviewService.findMany(filter);
	}

	// @Public()
	// findOne(@Param(':id') id) {
	// 	return this.reviewService.findOneByID(id);
	// }

	@Public()
	@Get(':reviewID')
	@ApiOperation({
		summary: 'Get many review',
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
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
			},
		},
	})
	@ApiParam({ name: 'reviewID', type: String, description: 'Review ID' })
	findOneByID(@Param('reviewID') reviewID) {
		return this.reviewService.findOneByID(reviewID);
	}
}
