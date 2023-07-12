import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	FacilityCategory,
	FacilityCategoryDocument,
} from './entities/facility-category';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { CreateCategoryDto } from './dto/create-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Injectable()
export class FacilityCategoryService {
	constructor(
		@InjectModel(FacilityCategory.name)
		private categoryModel: Model<FacilityCategoryDocument>,
	) {}

	async findOneById(categoryID: string): Promise<FacilityCategory> {
		const category = await this.categoryModel.findById(categoryID);
		if (!category) throw new NotFoundException('Category not found');
		return category;
	}

	async findMany(
		filter: ListOptions<FacilityCategory>,
	): Promise<ListResponse<FacilityCategory>> {
		const sortQuery = {};
		sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
		const limit = filter.limit || 0;
		const offset = filter.offset || 0;

		const categories = await this.categoryModel
			.find(filter)
			.sort(sortQuery)
			.limit(limit)
			.skip(offset);

		return {
			items: categories,
			total: categories.length,
			options: filter,
		};
	}

	async create(data: CreateCategoryDto): Promise<FacilityCategory> {
		return this.categoryModel.create(data);
	}

	async update(categoryID: string, data: UpdateCategoryDto) {
		const category = await this.categoryModel.findByIdAndUpdate(
			categoryID,
			data,
			{ new: true },
		);
		if (!category) throw new NotFoundException('Category not found');
		return category;
	}

	async delete(categoryID: string): Promise<string> {
		const category = await this.categoryModel.findByIdAndDelete(categoryID);

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		return 'Delete Category successful';
	}
}
