import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../../shared/repositories/base-abstract.repository';
import { Review, ReviewDocument } from '../schemas/reviews.schema';

@Injectable()
export class ReviewRepository extends BaseRepositoryAbstract<Review> {
	constructor(
		@InjectModel(Review.name)
		private photoModel: Model<ReviewDocument>,
	) {
		super(photoModel);
	}
}
