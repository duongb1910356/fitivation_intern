import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { BillItem } from '../bill-items/schemas/bill-item.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Bill, BillDocument, PaymentMethod } from './schemas/bill.schema';
import { Model } from 'mongoose';
import {
	ListResponse,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import { UserRole } from '../users/schemas/user.schema';
import { TokenPayload } from '../auth/types/token-payload.type';
import { PaymentOptDto } from '../carts/dto/payment-options-dto';

@Injectable()
export class BillsService {
	constructor(
		@InjectModel(Bill.name)
		private billModel: Model<BillDocument>,
	) {}

	async createOne(
		userID: string,
		billItems: BillItem[],
		paymentOpt: PaymentOptDto,
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

	async findMany(
		query: QueryObject,
		user: TokenPayload,
	): Promise<ListResponse<Bill>> {
		const queryFeatures = new QueryAPI(this.billModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		if (user.role === UserRole.MEMBER) {
			queryFeatures.queryModel.find({ accountID: user.sub });
		}

		const bills = await queryFeatures.queryModel;

		return {
			total: bills.length,
			queryOptions: queryFeatures.queryOptions,
			items: bills,
		};
	}

	async findOneByID(billID: string, user: TokenPayload): Promise<Bill> {
		const bill = await this.billModel.findById(billID);
		if (
			user.sub.toString() !== bill.accountID.toString() &&
			user.role === UserRole.MEMBER
		) {
			throw new ForbiddenException('Forbidden resource');
		}
		return bill;
	}

	async findOne(condition: any): Promise<Bill> {
		const bill = await this.billModel.findOne(condition);

		if (!bill) throw new NotFoundException('Bill not found');

		return bill;
	}
}
