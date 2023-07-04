import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { packageTypeData } from './data/package-type-data';

@Injectable()
export class PackageTypeSeeder implements Seeder {
	constructor(
		@InjectModel(PackageType.name)
		private readonly packageTypeModel: Model<PackageType>,
	) {}

	async seed(): Promise<any> {
		await this.packageTypeModel.insertMany(packageTypeData);
	}

	async drop(): Promise<any> {
		await this.packageTypeModel.deleteMany({});
	}
}
