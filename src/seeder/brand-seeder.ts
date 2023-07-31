import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Brand } from 'src/modules/brand/schemas/brand.schema';

@Injectable()
export class BrandSeeder implements Seeder {
	constructor(
		@InjectModel(Brand.name)
		private readonly brandModel: Model<Brand>,
	) {}

	async seed(): Promise<any> {
		const data = [
			{
				_id: '64944c7c2d7cf0ec0dbb4051',
				name: 'TheHinhOnline 1',
				accountID: '6497c6807a114f5b35a393fd',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				_id: '64944c7c2d7cf0ec0dbb4052',
				name: 'TheHinhOnline 2',
				accountID: '6497c6807a114f5b35a393fd',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		await this.brandModel.insertMany(data);
	}

	async drop(): Promise<any> {
		await this.brandModel.deleteMany({});
	}
}
