import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Bill } from 'src/modules/bills/schemas/bill.schema';
import { billData } from './data/bill-data';

@Injectable()
export class BillSeeder implements Seeder {
	constructor(
		@InjectModel(Bill.name)
		private readonly billModel: Model<Bill>,
	) {}

	async seed(): Promise<any> {
		await this.billModel.insertMany(billData);
	}
	async drop(): Promise<any> {
		await this.billModel.deleteMany({});
	}
}
