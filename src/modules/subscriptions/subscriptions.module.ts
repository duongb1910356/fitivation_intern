import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcriptionSchema, Subscription } from './schemas/subscription.schema';
import { PackageModule } from '../package/package.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Subscription.name, schema: SubcriptionSchema },
		]),
		PackageModule,
	],
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
