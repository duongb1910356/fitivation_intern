import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { FacilityCategory } from 'src/modules/facility-category/entities/facility-category';
import { categoryData } from './data/category-data';

@Injectable()
export class CategorySeeder implements Seeder {
	constructor(
		@InjectModel(FacilityCategory.name)
		private readonly facilityCategoryModel: Model<FacilityCategory>,
	) {}

	async seed(): Promise<any> {
		this.facilityCategoryModel.insertMany(categoryData);
	}

	async drop(): Promise<any> {
		await this.facilityCategoryModel.deleteMany({});
	}
}
