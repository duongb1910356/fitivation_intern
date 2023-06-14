import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/reviews.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
	],
	controllers: [ReviewsController],
	providers: [],
})
export class ReviewsModule {}
