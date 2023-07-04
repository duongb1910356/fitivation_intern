import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Package } from 'src/modules/package/entities/package.entity';
import { packageData } from './data/package-data';

@Injectable()
export class PackageSeeder implements Seeder {
	constructor(
		@InjectModel(Package.name)
		private readonly packageModel: Model<Package>,
	) {}

	async seed(): Promise<any> {
		await this.packageModel.insertMany(packageData);
	}

	async drop(): Promise<any> {
		await this.packageModel.deleteMany({});
	}
}
