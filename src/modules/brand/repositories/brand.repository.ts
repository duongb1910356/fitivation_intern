import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/modules/brand/schemas/brand.schema';
import { BaseRepositoryAbstract } from '../../../shared/repositories/base-abstract.repository';

@Injectable()
export class BrandRepository extends BaseRepositoryAbstract<Brand> {
	constructor(
		@InjectModel(Brand.name)
		private brandModel: Model<BrandDocument>,
	) {
		super(brandModel);
	}

	doSomethings(): void {
		//
	}
}
