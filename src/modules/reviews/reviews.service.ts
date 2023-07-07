import { Injectable, Req } from '@nestjs/common';
import { Review, ReviewDocument } from './schemas/reviews.schema';
import { CreateReviewDto } from './dto/create-review-dto';
import { PhotoService } from '../photo/photo.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,

		private readonly photoService: PhotoService,
	) {}

	async create(
		@Req() req: any,
		reviewDto: CreateReviewDto,
		files?: { images?: Express.Multer.File[] },
	): Promise<Review> {
		reviewDto.accountID = req.user.sub;
		const createdReview = await this.reviewModel.create(reviewDto);
		if (files && files.images) {
			const photos = await this.photoService.uploadManyFile(
				files,
				createdReview._id,
			);
			createdReview.photos = photos.items;
		}
		return await createdReview.save();
	}

	async findMany(filter: ListOptions<Review>): Promise<ListResponse<Review>> {
		const sortQuery = {};
		sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
		const limit = filter.limit || 0;
		const offset = filter.offset || 0;

		const result = await this.reviewModel
			.find(filter)
			.sort(sortQuery)
			.skip(offset)
			.limit(limit);
		return {
			items: result,
			total: result?.length,
			options: filter,
		};
	}

	async findOneByID(id: string): Promise<Review> {
		return await this.reviewModel.findById(id);
	}

	async delete(id: string): Promise<boolean> {
		const deletedReview = await this.reviewModel.findOneAndDelete({ _id: id });
		if (deletedReview) {
			deletedReview.photos.forEach(async (el) => {
				await this.photoService.delete(el._id);
			});
		}
		return null;
	}

	// async deleteByID(id: string): Promise<SuccessResponse<Review>> {
	// 	try {
	// 		const review = await this.reviewModel.findOneAndDelete({ _id: id });
	// 		if (!review) {
	// 			throw new NotFoundException('Review not found!');
	// 		}

	// 		review.photos.forEach((re) => {
	// 			// this.photoService.deleteOne(re._id);
	// 		});
	// 	} catch (error) {
	// 		console.log('Error: delete Review >> ', error);
	// 		throw new BadRequestException(error);
	// 	}

	// 	return null;
	// }
}