import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/reviews.schema';
import { CreateReviewDto } from './dto/create-review-dto';
import { PhotoService } from '../photo/photo.service';
import { CreatePhotoDto } from '../photo/dto/create-photo-dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { generateUniqueId } from 'src/utils/gen-uid';
import { SuccessResponse } from 'src/shared/response/success-response';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
		private readonly photoService: PhotoService,
	) {}

	async createOne(
		files: { images?: Express.Multer.File[] },
		@Req() req: any,
		reviewDto: CreateReviewDto,
	): Promise<Review> {
		try {
			const photoDto: CreatePhotoDto = {
				ownerID: generateUniqueId(),
				// ownerID: req.user.uid,
			};
			const photos = await this.photoService.uploadManyFile(files, photoDto);

			reviewDto.accountID = req.user.uid;
			return this.reviewModel.create({
				...reviewDto,
				photos: photos.items,
			});
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async deleteByID(id: string): Promise<SuccessResponse<Review>> {
		try {
			const review = await this.reviewModel.findOneAndDelete({ _id: id });
			if (!review) {
				throw new NotFoundException('Review not found!');
			}

			review.photos.forEach((re) => {
				this.photoService.deleteOne(re._id);
			});
		} catch (error) {
			console.log('Error: delete Review >> ', error);
			throw new BadRequestException(error);
		}

		return null;
	}

	async findMany(filter: ListOptions<Review>): Promise<ListResponse<Review>> {
		try {
			const limit = filter.limit || 0;
			const offset = filter.offset || 0;
			console.log('da chay toi day');
			const photos = await this.reviewModel
				.find(filter)
				.skip(offset)
				.limit(limit);

			return {
				items: photos,
				total: photos.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(error);
		}
	}
}
