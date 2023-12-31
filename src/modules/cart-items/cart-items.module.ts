import { Module } from '@nestjs/common';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';
import { PackageModule } from '../package/package.module';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: CartItem.name, schema: CartItemSchema },
		]),
		PackageModule,
		PromotionsModule,
	],
	controllers: [CartItemsController],
	providers: [CartItemsService],
	exports: [CartItemsService],
})
export class CartItemsModule {}
