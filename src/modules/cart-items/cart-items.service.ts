import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartItemsService {
	constructor(
		@InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
	) {}
}
