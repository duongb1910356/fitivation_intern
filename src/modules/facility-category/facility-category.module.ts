import { Module } from '@nestjs/common';
import { FacilityCategoryController } from './facility-category.controller';
import { FacilityCategoryService } from './facility-category.service';

@Module({
	controllers: [FacilityCategoryController],
	providers: [FacilityCategoryService],
})
export class FacilityCategoryModule {}
