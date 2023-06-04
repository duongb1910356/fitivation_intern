import { Module } from '@nestjs/common';
import { BillItemsController } from './bill-items.controller';
import { BillItemsService } from './bill-items.service';

@Module({
	controllers: [BillItemsController],
	providers: [BillItemsService],
})
export class BillItemsModule {}
