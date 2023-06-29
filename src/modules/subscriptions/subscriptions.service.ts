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
		private packageSerive: PackageService,
	) {}

	async findOneByCondition(condition: any): Promise<Subscription> {
		const subscription = await this.subscriptionsModel.findOne(condition);
		if (!subscription) throw new NotFoundException('Not found Subscription');

		return subscription;
	}
	async findMany(
		query: QueryObject,
		user: TokenPayload,
	): Promise<ListResponse<Subscription>> {
		const queryFeatures = new QueryAPI(this.subscriptionsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		if (user.role === UserRole.MEMBER) {
			queryFeatures.queryModel.find({ accountID: user.sub });
		}

		const subscription = await queryFeatures.queryModel;

		for (let i = 0; i < subscription.length; i++) {
			await this.checkDateAndUpdateDateIsExpired(
				subscription[i]._id.toString(),
				user,
			);
		}

		return {
			total: subscription.length,
			queryOptions: queryFeatures.queryOptions,
			items: subscription,
		};
	}
	async findOneByID(
		subscriptionID: string,
		user: TokenPayload,
	): Promise<Subscription> {
		const subscription = await this.subscriptionsModel.findById(subscriptionID);

		if (!subscription) throw new BadRequestException('Subscription not found');

		if (
			user.sub.toString() !== subscription.accountID.toString() &&
			user.role === UserRole.MEMBER
		) {
			throw new ForbiddenException('Forbidden resource');
		}
		return subscription;
	}

	async createOne(
		userID: string,
		billItemID: string,
		packageID: string,
		facilityID: string,
	): Promise<Subscription> {
		const packageItem = await this.packageSerive.findOneByID(packageID);
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
			subscription.save();
			return {
				message: 'Subscription was expired',
				subscription,
			};
		} else {
			subscription.renew = false;
			subscription.save();
			return {
				message: 'Subscription has not expired',
				subscription,
			};
		}
	}

	async renew(
		subscriptionID: string,
		user: TokenPayload,
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

		const packageItem = await this.packageSerive.findOneByID(
			subscription.packageID.toString(),
		);

		const packageTimeType = parseInt(packageItem.type) * 30;
		const newExpires = this.addDays(new Date(Date.now()), packageTimeType);

		subscription.expires = newExpires;
		subscription.renew = false;
		subscription.save();

		return subscription;
	}
}
