import { Module } from '@nestjs/common';
import { BillItemsController } from './bill-items.controller';
import { BillItemsService } from './bill-items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BillItem, BillItemSchema } from './schemas/bill-item.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: BillItem.name, schema: BillItemSchema },
		]),
	],
	controllers: [BillItemsController],
	providers: [BillItemsService],
	exports: [BillItemsService],
})
export class BillItemsModule {}
