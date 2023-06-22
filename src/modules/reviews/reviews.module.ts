import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Review, ReviewSchemaFactory } from './schemas/reviews.schema';
import { ReviewService } from './reviews.service';
import { PhotoModule } from '../photo/photo.module';
import { ReviewRepository } from './repositories/reviews.repository';
import { Facility, FacilitySchema } from '../facility/schemas/facility.schema';

@Module({
	imports: [
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
	providers: [
		ReviewService,
		{ provide: 'ReviewRepository', useClass: ReviewRepository },
	],
	exports: [ReviewService],
})
export class ReviewsModule {}
