import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BillItem } from '../bill-items/schemas/bill-item.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Bill, BillDocument, PaymentMethod } from './schemas/bill.schema';
import { Model } from 'mongoose';

@Injectable()
export class BillsService {
	constructor(
		@InjectModel(Bill.name)
		private billModel: Model<BillDocument>,
	) {}

	async createOne(
		userID: string,
		billItems: BillItem[],
		paymentOpt: any,
	): Promise<Bill> {
		let totalPrice = 0;

		for (let i = 0; i < billItems.length; i++) {
			totalPrice += billItems[i].totalPrice;
		}

		const billObj = {
			accountID: userID,
			billItems: billItems,
			paymentMethod: paymentOpt.paymentMethod || PaymentMethod.CREDIT_CARD,
			taxes: paymentOpt.taxes || 0,
			description: paymentOpt.description || '',
			promotions: [],
			promotionPrice: 0,
			totalPrice: totalPrice,
		};

		const bill = await this.billModel.create(billObj);

		if (!bill)
			throw new InternalServerErrorException('Create Bill-item failed');

		return bill;
	}
}
