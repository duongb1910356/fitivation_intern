import { Module } from '@nestjs/common';
import { CartItemsController } from './cart-items.controller';

@Module({
  controllers: [CartItemsController]
})
export class CartItemsModule {}
