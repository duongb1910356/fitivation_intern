import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

@Injectable()
export class BrandService {
	constructor(
		@InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
	) {}

	async create(createBrand: CreateBrandDto, accountID: string): Promise<Brand> {
		try {
			const checkExist = await this.brandModel.findOne({
				name: createBrand.name,
			});
			if (!checkExist) {
				const input = {
					...createBrand,
					accountID: accountID,
				};
				return await this.brandModel.create(input);
			}
			throw new BadRequestException('Name already exists');
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findOneByID(id: string): Promise<Brand> {
		try {
			const brand = await this.brandModel.findById(id);
			if (brand) return brand;
			throw new NotFoundException('Brand not found');
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async findMany(filter: ListOptions<Brand>): Promise<ListResponse<Brand>> {
		try {
			const {
				limit,
				offset,
				// searchField,
				// searchValue,
				sortField,
				sortOrder,
				...condition
			} = filter;

			const validFields = Object.keys(this.brandModel.schema.paths);
			const validConditions = {};
			for (const key in condition) {
				if (validFields.includes(key)) {
					validConditions[key] = condition[key];
				}
			}
			if (Object.keys(validConditions).length != 0) {
				const brand = await this.brandModel
					.find(validConditions)
					.sort({ [sortField]: sortOrder })
					.skip(offset)
					.limit(limit);

				if (brand) {
					return {
						items: brand,
						total: brand.length,
						options: filter,
					};
				}
			}
			throw new NotFoundException('Brand not found');
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async deleteOne(id: string) {
		try {
			if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');
			const brand = await this.brandModel.findOneAndRemove({
				_id: id,
			});
			if (brand) return null;
			throw new NotFoundException('Brand not found');
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
