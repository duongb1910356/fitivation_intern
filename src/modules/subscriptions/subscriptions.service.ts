import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '../users/schemas/user.schema';
import { TokenPayload } from '../auth/types/token-payload.type';
import {
	ListResponse,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import {
	Subscription,
	SubscriptionDocument,
} from './schemas/subscription.schema';
import { PackageService } from '../package/package.service';

@Injectable()
export class SubscriptionsService {
	constructor(
		@InjectModel(Subscription.name)
		private subscriptionsModel: Model<SubscriptionDocument>,
		private packageService: PackageService,
	) {}

	async findOneByCondition(condition: any): Promise<Subscription> {
		const subscription = await this.subscriptionsModel.findOne(condition);
		if (!subscription) throw new NotFoundException('Not found Subscription');

		return subscription;
	}
	async findMany(
		query: QueryObject,
		user: TokenPayload,
		populateOpt?: any,
	): Promise<ListResponse<Subscription>> {
		const queryFeatures = new QueryAPI(this.subscriptionsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		if (user.role === UserRole.MEMBER) {
			queryFeatures.queryModel.find({ accountID: user.sub });
		}

		const subscriptions = await queryFeatures.queryModel.populate(populateOpt);

		const subscriptionIDs = [];

		for (let i = 0; i < subscriptions.length; i++) {
			await this.checkDateAndUpdateDateIsExpired(
				subscriptions[i]._id.toString(),
				user,
			);
			subscriptionIDs.push(subscriptions[i]._id);
		}

		const results = await this.subscriptionsModel
			.find({
				_id: {
					$in: subscriptionIDs,
				},
			})
			.populate(populateOpt);

		return {
			total: subscriptions.length,
			queryOptions: queryFeatures.queryOptions,
			items: results,
		}; // fix not return new
	}
	async findOneByID(
		subscriptionID: string,
		user: TokenPayload,
		populateOpt?: any,
	): Promise<Subscription> {
		const subscription = await this.subscriptionsModel
			.findById(subscriptionID)
			.populate(populateOpt);

		if (!subscription) throw new BadRequestException('Subscription not found');

		if (
			user.sub.toString() !== subscription.accountID.toString() &&
			user.role === UserRole.MEMBER
		) {
			throw new ForbiddenException('Forbidden resource');
		}

		await this.checkDateAndUpdateDateIsExpired(
			subscription._id.toString(),
			user,
		);

		return await this.subscriptionsModel
			.findById(subscriptionID)
			.populate(populateOpt); // fix not return new
	}

	async createOne(
		userID: string,
		billItemID: string,
		packageID: string,
		facilityID: string,
	): Promise<Subscription> {
		const packageItem = await this.packageService.findOneByID(packageID);
		const packageTimeType = parseInt(packageItem.type) * 30;

		const date = new Date(Date.now());
		const expires = this.addDays(date, packageTimeType);

		const subscription = await this.subscriptionsModel.create({
			accountID: userID,
			billItemID,
			packageID,
			facilityID,
			expires,
		});

		return subscription;
	}
	addDays(date: Date, days: number): Date {
		date.setDate(date.getDate() + days);
		return date;
	}

	async checkDateAndUpdateDateIsExpired(
		subscriptionID: string,
		user: TokenPayload,
	): Promise<any> {
		const subscription = await this.subscriptionsModel.findById(subscriptionID);

		if (!subscription) throw new BadRequestException('Subscription not found');

		if (user.role !== UserRole.ADMIN) {
			if (user.sub.toString() !== subscription.accountID.toString()) {
				throw new ForbiddenException('Forbidden resource');
			}
		}

		if (new Date(subscription.expires) <= new Date(Date.now())) {
			subscription.renew = true;
			await subscription.save();

			return {
				message: 'Subscription was expired',
				subscription,
			};
		} else {
			subscription.renew = false;
			await subscription.save();

			return {
				message: 'Subscription has not expired',
				subscription,
			};
		}
	}

	async renew(
		subscriptionID: string,
		billItemID: string,
		user: TokenPayload,
		populateOpt?: any,
	): Promise<Subscription> {
		// ...check payment

		const subscription = await this.subscriptionsModel.findById(subscriptionID);

		if (!subscription) throw new BadRequestException('Subscription not found');

		const isExpires = await this.checkDateAndUpdateDateIsExpired(
			subscriptionID,
			user,
		);

		if (isExpires.message === 'Subscription has not expired') {
			throw new BadRequestException('Subscription has not expired');
		}

		if (
			user.sub.toString() !== subscription.accountID.toString() &&
			user.role === UserRole.MEMBER
		) {
			throw new ForbiddenException('Forbidden resource');
		}

		const packageItem = await this.packageService.findOneByID(
			subscription.packageID.toString(),
		);

		const packageTimeType = parseInt(packageItem.type) * 30;
		const newExpires = this.addDays(new Date(Date.now()), packageTimeType);

		subscription.expires = newExpires;
		subscription.renew = false;
		subscription.billItemID = billItemID;
		await subscription.save();

		return await this.subscriptionsModel
			.findById(subscriptionID)
			.populate(populateOpt); // fix not return new
	}

	async deleteOneByBillItemID(billItemID: string): Promise<boolean> {
		const subscription = await this.subscriptionsModel.findOneAndRemove({
			billItemID,
		});

		if (!subscription) return false;

		return true;
	}
}
