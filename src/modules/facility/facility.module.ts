import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchemaFactory } from './schemas/facility.schema';
import { FacilityService } from './facility.service';
import { ReviewsModule } from '../reviews/reviews.module';
import { PhotoModule } from '../photo/photo.module';

@Module({
	// imports: [
	// 	MongooseModule.forFeature([
	// 		{ name: Facility.name, schema: FacilitySchema },
	// 	]),
	// 	MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
	// ],
	// controllers: [FacilityController],
	// providers: [FacilityService],
	// exports: [FacilityService],

	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Facility.name,
				useFactory: FacilitySchemaFactory,
				inject: [],
				imports: [],
			},
		]),
		PhotoModule,
		ReviewsModule,
	],
	controllers: [FacilityController],
	providers: [FacilityService],
	exports: [FacilityService],
})
export class FacilityModule {}
