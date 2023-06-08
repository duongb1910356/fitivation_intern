import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { User, UserRole } from '../modules/users/schemas/user.schema';
import { Password } from '../utils/password';
import { level1s } from 'dvhcvn';
import { District } from 'src/modules/address/schemas/district.schema';

@Injectable()
export class DistrictSeeder implements Seeder {
	constructor(
		@InjectModel(District.name)
		private readonly provinceModel: Model<District>,
	) {}

	async seed(): Promise<any> {
		const items: any[] = [];

        level1s.forEach((element, index) => {
            items.push({name: element.name, code: element.name})
        });

		await this.provinceModel.insertMany(items);
	}
	async drop(): Promise<any> {
		await this.provinceModel.deleteMany({});
	}
}
