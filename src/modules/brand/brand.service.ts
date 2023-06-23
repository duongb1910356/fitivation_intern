import { Injectable, Req } from '@nestjs/common';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

@Injectable()
export class BrandService {
	constructor(
		@InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
	) {}

	async create(
		createBrandDto: CreateBrandDto,
		@Req() req: any,
	): Promise<Brand> {
		createBrandDto.accountID = req.user.uid;
		return await this.brandModel.create(createBrandDto);
	}

	async findMany(filter: ListOptions<Brand>): Promise<ListResponse<Brand>> {
		const sortQuery = {};
		sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
		const limit = filter.limit || 0;
		const offset = filter.offset || 0;
		const result = await this.brandModel
			.find(filter)
			.sort(sortQuery)
			.skip(offset)
			.limit(limit);
		return {
			items: result,
			total: result?.length,
			options: filter,
		};
	}

	async findOneByID(id: string): Promise<Brand> {
		return await this.brandModel.findById(id);
	}

	async delete(id: string): Promise<boolean> {
		return await this.brandModel.findOneAndDelete({ _id: id });
	}
}
