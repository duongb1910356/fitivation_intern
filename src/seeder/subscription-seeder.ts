import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Subscription } from 'src/modules/subscriptions/schemas/subscription.schema';
import { subscriptionData } from './data/subscription-data';

@Injectable()
export class SubscriptionSeeder implements Seeder {
	constructor(
		@InjectModel(Subscription.name)
		private readonly subscriptionModel: Model<Subscription>,
	) {}

	async seed(): Promise<any> {
		await this.subscriptionModel.insertMany(subscriptionData);
	}
	async drop(): Promise<any> {
		await this.subscriptionModel.deleteMany({});
	}
}
