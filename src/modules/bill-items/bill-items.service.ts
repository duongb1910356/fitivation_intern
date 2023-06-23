import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillItem, BillItemsDocument } from './schemas/bill-item.schema';

@Injectable()
export class BillItemsService {
	constructor(
		@InjectModel(BillItem.name)
		private billItemsModel: Model<BillItemsDocument>,
	) {}

	async findOneByCondition(condition: any): Promise<BillItem> {
		return await this.billItemsModel.findOne(condition);
	}
}
