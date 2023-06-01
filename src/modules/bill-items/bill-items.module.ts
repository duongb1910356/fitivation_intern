import { Module } from '@nestjs/common';
import { BillItemsController } from './bill-items.controller';

@Module({
	controllers: [BillItemsController],
})
export class BillItemsModule {}
