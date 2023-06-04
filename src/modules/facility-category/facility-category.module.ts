import { Module } from '@nestjs/common';
import { FacilityCategoryController } from './facility-category.controller';
import { FacilityCategoryService } from './facility-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityCategory } from './entities/facility-category';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: FacilityCategory.name, schema: FacilityCategory },
		]),
	],
	controllers: [FacilityCategoryController],
	providers: [FacilityCategoryService],
})
export class FacilityCategoryModule {}
