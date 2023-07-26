import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BillItemsModule } from '../bill-items/bill-items.module';
import { BillsModule } from '../bills/bills.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CartsModule } from '../carts/carts.module';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { UsersModule } from '../users/users.module';
import { StripeModule } from 'nestjs-stripe';
import { appConfig } from 'src/app.config';

@Module({
	imports: [
		BillItemsModule,
		BillsModule,
		SubscriptionsModule,
		CartsModule,
		CartItemsModule,
		UsersModule,
		StripeModule.forRoot({
			apiKey: `${appConfig.stripeSecretKey}`,
			apiVersion: '2022-11-15',
		}),
	],
	providers: [PaymentsService],
	controllers: [PaymentsController],
})
export class PaymentsModule {}
