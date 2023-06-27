import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { PackageModule } from '../package/package.module';
import { CartItemsModule } from '../cart-items/cart-items.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
		PackageModule,
		CartItemsModule,
	],
	controllers: [CartsController],
	providers: [CartsService],
	exports: [CartsService],
})
export class CartsModule {}
