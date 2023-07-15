import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { BillItem } from '../bill-items/schemas/bill-item.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Bill, BillDocument, PaymentStatus } from './schemas/bill.schema';
import { Model } from 'mongoose';
import {
	ListResponse,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import { UserRole } from '../users/schemas/user.schema';
import { TokenPayload } from '../auth/types/token-payload.type';
import { CartPaymentRequestDto } from '../payments/dto/cart-payment-request-dto';
import { BillItemsService } from '../bill-items/bill-items.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionPaymentRequestDto } from '../payments/dto/subscription-payment-request-dto';
import { PaymentMethodDto } from '../payments/dto/payment-method-dto';

@Injectable()
export class BillsService {
	constructor(
		@InjectModel(Bill.name)
		private billModel: Model<BillDocument>,
		private billItemService: BillItemsService,
		private subscriptionService: SubscriptionsService,
	) {}

	async createOne(
		userID: string,
		billItems: BillItem[],
		PaymentRequestDto: CartPaymentRequestDto | SubscriptionPaymentRequestDto,
	): Promise<Bill> {
		let totalPrice = 0;

		for (let i = 0; i < billItems.length; i++) {
			totalPrice += billItems[i].totalPrice;
		}

		const billObj = {
			accountID: userID,
			billItems: billItems,
			// taxes: PaymentRequestDto.taxes || 0,
			description: PaymentRequestDto.description || '',
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

		if (!bill) throw new NotFoundException('Bill not found');

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

	async deleteOneByID(billID: string): Promise<boolean> {
		const bill = await this.billModel.findById(billID);

		if (!bill) return false;

		const billItems = bill.billItems;

		for (let i = 0; i < billItems.length; i++) {
			await this.billItemService.deleteOneByID(billItems[i]._id.toString());
			await this.subscriptionService.deleteOneByBillItemID(
				billItems[i]._id.toString(),
			);
		}

		await this.billModel.deleteOne({ _id: billID });

		return true;
	}

	async updatePaymentStatus(
		billID: string,
		status: PaymentStatus,
	): Promise<boolean> {
		const bill = await this.billModel.findByIdAndUpdate(
			billID,
			{
				paymentStatus: status,
			},
			{
				new: true,
				runValidators: true,
			},
		);

		if (!bill) return false;

		return true;
	}

	async updatePaymentMethod(
		billID: string,
		paymentMethod: PaymentMethodDto,
	): Promise<boolean> {
		const bill = await this.billModel.findByIdAndUpdate(billID, paymentMethod, {
			new: true,
			runValidators: true,
		});

		if (!bill) return false;

		return true;
	}
}
