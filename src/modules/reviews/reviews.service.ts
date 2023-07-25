import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { Review, ReviewDocument } from './schemas/reviews.schema';
import { CreateReviewDto } from './dto/create-review-dto';
import { PhotoService } from '../photo/photo.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
			try {
				const photos = await this.photoService.uploadManyFile(
					files,
					createdReview._id,
				);
				createdReview.photos = photos.items;
				await createdReview.save();
			} catch (error) {
				createdReview.delete();
				throw new BadRequestException('Review creation failed');
			}
		}
		return createdReview;
	}

	async findMany(filter: ListOptions<Review>): Promise<ListResponse<Review>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
			const limit = filter.limit || 10;
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
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving reviews',
			);
		}
	}

	async getReview(filter: ListOptions<Review>): Promise<ListResponse<Review>> {
		try {
			const sortQuery = {};
			sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
			const limit = parseInt(filter.limit.toString()) || 10;
			const offset = parseInt(filter.offset.toString()) || 0;

			const result = await this.reviewModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit)
				.populate({
					path: 'accountID',
					select: 'username avatar',
				});

			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving reviews',
			);
		}
	}

	async findOneByID(id: string): Promise<Review> {
		return await this.reviewModel.findById(id);
	}

	async delete(id: string): Promise<Review> {
		const deletedReview = await this.reviewModel.findOneAndDelete({ _id: id });
		if (deletedReview) {
			deletedReview.photos.forEach(async (el) => {
				await this.photoService.delete(el._id);
			});
		}
		return deletedReview;
	}

	async caculateAverageRating(facilityID: string): Promise<number> {
		try {
			const objectId = new Types.ObjectId(facilityID);

			const aggregateResult = await this.reviewModel.aggregate([
				{ $match: { facilityID: objectId } },
				{ $group: { _id: null, averageStar: { $avg: '$rating' } } },
			]);

			const averageStar =
				aggregateResult.length > 0 ? aggregateResult[0].averageStar : undefined;

			return parseFloat(averageStar.toFixed(2));
		} catch (error) {
			return undefined;
		}
	}
}
