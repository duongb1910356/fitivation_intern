import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Review, ReviewSchemaFactory } from './schemas/reviews.schema';
import { ReviewService } from './reviews.service';
import { Photo, PhotoSchema } from '../photo/schemas/photo.schema';
import { PhotoModule } from '../photo/photo.module';
import { ReviewRepository } from './repositories/reviews.repository';

@Module({
	imports: [
		// MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
		// PhotoModule,
		MongooseModule.forFeatureAsync([
			{
				name: Review.name,
				useFactory: ReviewSchemaFactory,
				inject: [getModelToken(Photo.name)],
				imports: [
					MongooseModule.forFeature([
						{ name: Photo.name, schema: PhotoSchema },
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
})
export class ReviewsModule {}
