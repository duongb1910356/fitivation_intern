import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BillItemsModule } from '../bill-items/bill-items.module';
import { BillsModule } from '../bills/bills.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CartsModule } from '../carts/carts.module';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		BillItemsModule,
		BillsModule,
		SubscriptionsModule,
		CartsModule,
		CartItemsModule,
		UsersModule,
	],
	providers: [PaymentsService],
	controllers: [PaymentsController],
})
export class PaymentsModule {}
