import { Inject, Injectable, Req } from '@nestjs/common';
import { Review } from './schemas/reviews.schema';
import { BaseServiceAbstract } from 'src/shared/services/base-abstract.service';
import { ReviewRepository } from './repositories/reviews.repository';
import { CreateReviewDto } from './dto/create-review-dto';
import { generateUniqueId } from 'src/utils/gen-uid';
import { CreatePhotoDto } from '../photo/dto/create-photo-dto';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class ReviewService extends BaseServiceAbstract<Review> {
	constructor(
		@Inject('ReviewRepository')
		private readonly reviewRepository: ReviewRepository,
		private readonly photoService: PhotoService,
	) {
		super(reviewRepository);
	}

	// constructor(
	// 	@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
	// 	private readonly photoService: PhotoService,
	// ) {}

	async createReviewWithFiles(
		files: { images?: Express.Multer.File[] },
		@Req() req: any,
		reviewDto: CreateReviewDto,
	): Promise<Review> {
		const photoDto: CreatePhotoDto = {
			ownerID: generateUniqueId(),
			// ownerID: req.user.uid,
		};
		const photos = await this.photoService.uploadManyFile(files, photoDto);

		reviewDto.accountID = req.user.uid;
		reviewDto.photos = photos.items;
		return super.create(reviewDto);
	}

	async delete(id: string): Promise<boolean> {
		const review = await this.reviewRepository.findOneByID(id);
		review.photos.forEach((re) => {
			this.photoService.delete(re._id);
		});
		return await super.delete(id);
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
