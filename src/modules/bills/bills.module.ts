import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schemas/bill.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
	],
	controllers: [BillsController],
	providers: [BillsService],
	exports: [BillsService],
})
export class BillsModule {}
