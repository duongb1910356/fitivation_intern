import { Injectable } from '@nestjs/common';
import { Subscription } from './schemas/subscription.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionsModule } from './subscriptions.module';

@Injectable()
export class SubscriptionsService {
	constructor(
		@InjectModel(Subscription.name)
		private subscriptionsModel: Model<SubscriptionsModule>,
	) {}

	async findOneByCondition(condition: any): Promise<Subscription> {
		return await this.subscriptionsModel.findOne(condition);
	}
}
