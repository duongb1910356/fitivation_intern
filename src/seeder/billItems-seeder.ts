import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { BillItem } from 'src/modules/bill-items/schemas/bill-item.schema';
import { billItemsData } from './data/billItems-data';

@Injectable()
export class BillItemSeeder implements Seeder {
	constructor(
		@InjectModel(BillItem.name)
		private readonly billItemModel: Model<BillItem>,
	) {}

	async seed(): Promise<any> {
		await this.billItemModel.insertMany(billItemsData);
	}
	async drop(): Promise<any> {
		await this.billItemModel.deleteMany({});
	}
}
