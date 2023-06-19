import { BadRequestException, Inject, Injectable, Req } from '@nestjs/common';
import { Brand } from './schemas/brand.schema';
import { BrandRepository } from 'src/modules/brand/repositories/brand.repository';
import { BaseServiceAbstract } from 'src/shared/services/base-abstract.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService extends BaseServiceAbstract<Brand> {
	// private brandModel: Model<BrandDocument>,
	constructor(
		@Inject('BrandRepository')
		private readonly brandRepository: BrandRepository,
	) {
		super(brandRepository);
	}

	async createBrand(
		createBrandDto: CreateBrandDto,
		@Req() req: any,
	): Promise<Brand> {
		createBrandDto.accountID = req.user.uid;
		return super.create(createBrandDto);
	}

	// async findOneByID(id: string): Promise<Brand> {
	// 	try {
	// 		// const brand = await this.brandModel.findById(id);
	// 		// if (brand) return brand;
	// 		return this.brandRepository.findOneByID(id);
	// 		// throw new NotFoundException('Brand not found');
	// 	} catch (error) {
	// 		throw new BadRequestException(error);
	// 	}
	// }

	// async findMany(filter: ListOptions<Brand>): Promise<ListResponse<Brand>> {
	// 	try {
	// 		const {
	// 			limit,
	// 			offset,
	// 			// searchField,
	// 			// searchValue,
	// 			sortField,
	// 			sortOrder,
	// 			...condition
	// 		} = filter;

	// 		const validFields = Object.keys(this.brandModel.schema.paths);
	// 		const validConditions = {};
	// 		for (const key in condition) {
	// 			if (validFields.includes(key)) {
	// 				validConditions[key] = condition[key];
	// 			}
	// 		}
	// 		if (Object.keys(validConditions).length != 0) {
	// 			const brand = await this.brandModel
	// 				.find(validConditions)
	// 				.sort({ [sortField]: sortOrder })
	// 				.skip(offset)
	// 				.limit(limit);

	// 			if (brand) {
	// 				return {
	// 					items: brand,
	// 					total: brand.length,
	// 					options: filter,
	// 				};
	// 			}
	// 		}
	// 		throw new NotFoundException('Brand not found');
	// 	} catch (error) {
	// 		throw new BadRequestException(error);
	// 	}
	// }

	// async deleteOne(id: string) {
	// 	try {
	// 		if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');
	// 		const brand = await this.brandModel.findOneAndRemove({
	// 			_id: id,
	// 		});
	// 		if (brand) return null;
	// 		throw new NotFoundException('Brand not found');
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }
}
