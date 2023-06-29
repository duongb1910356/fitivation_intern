import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/reviews.schema';
import { ReviewService } from './reviews.service';
import { PhotoModule } from '../photo/photo.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),

		// MongooseModule.forFeatureAsync([
		// 	{
		// 		name: Review.name,
		// 		useFactory: ReviewSchemaFactory,
		// 		inject: [],
		// 		imports: [],
		// 	},
		// ]),
		PhotoModule,
	],
	controllers: [ReviewsController],
	providers: [ReviewService],
	exports: [ReviewService],
})
export class ReviewsModule {}
