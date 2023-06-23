import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Review, ReviewSchemaFactory } from './schemas/reviews.schema';
import { ReviewService } from './reviews.service';
import { PhotoModule } from '../photo/photo.module';
import { Facility, FacilitySchema } from '../facility/schemas/facility.schema';

@Module({
	imports: [
		// MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),

		MongooseModule.forFeatureAsync([
			{
				name: Review.name,
				useFactory: ReviewSchemaFactory,
				inject: [getModelToken(Facility.name)],
				imports: [
					MongooseModule.forFeature([
						{ name: Facility.name, schema: FacilitySchema },
					]),
				],
			},
		]),
		PhotoModule,
	],
	controllers: [ReviewsController],
	providers: [ReviewService],
	exports: [ReviewService],
})
export class ReviewsModule {}
