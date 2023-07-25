import { Module } from '@nestjs/common';
import { FacilityCategoryController } from './facility-category.controller';
import { FacilityCategoryService } from './facility-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
	FacilityCategory,
	FacilityCategorySchema,
} from './entities/facility-category';
import { PhotoModule } from '../photo/photo.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: FacilityCategory.name, schema: FacilityCategorySchema },
		]),
		PhotoModule,
	],
	controllers: [FacilityCategoryController],
	providers: [FacilityCategoryService],
	exports: [FacilityCategoryService],
})
export class FacilityCategoryModule {}
