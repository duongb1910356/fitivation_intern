import { Module } from '@nestjs/common';
import { BillItemsController } from './bill-items.controller';
import { BillItemsService } from './bill-items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BillItem, BillItemSchema } from './schemas/bill-item.schema';
import { PackageModule } from '../package/package.module';
import { BrandModule } from '../brand/brand.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: BillItem.name, schema: BillItemSchema },
		]),
		PackageModule,
		BrandModule,
	],
	controllers: [BillItemsController],
	providers: [BillItemsService],
	exports: [BillItemsService],
})
export class BillItemsModule {}
