import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schemas/bill.schema';
import { BillItemsModule } from '../bill-items/bill-items.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
		BillItemsModule,
		SubscriptionsModule,
	],
	controllers: [BillsController],
	providers: [BillsService],
	exports: [BillsService],
})
export class BillsModule {}
