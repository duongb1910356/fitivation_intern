import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Review } from 'src/modules/reviews/schemas/reviews.schema';
import { reviewData } from './data/review-data';
@Injectable()
export class ReviewSeeder implements Seeder {
	constructor(
		@InjectModel(Review.name)
		private readonly reviewModel: Model<Review>,
	) {}

	async seed(): Promise<any> {
		await this.reviewModel.insertMany(reviewData);
	}

	async drop(): Promise<any> {
		await this.reviewModel.deleteMany({});
	}
}
