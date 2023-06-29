import { Module } from '@nestjs/common';
import { BillItemsController } from './bill-items.controller';
import { BillItemsService } from './bill-items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BillItem, BillItemSchema } from './schemas/bill-item.schema';
import { PackageModule } from '../package/package.module';
import { FacilityModule } from '../facility/facility.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: BillItem.name, schema: BillItemSchema },
		]),
		PackageModule,
		FacilityModule,
		BillItemsModule,
	],
	controllers: [BillItemsController],
	providers: [BillItemsService],
	exports: [BillItemsService],
})
export class BillItemsModule {}
