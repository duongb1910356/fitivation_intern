import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Cart } from 'src/modules/carts/schemas/cart.schema';
import { cartData } from './data/cart-data';

@Injectable()
export class CartSeeder implements Seeder {
	constructor(
		@InjectModel(Cart.name)
		private readonly cartModel: Model<Cart>,
	) {}

	async seed(): Promise<any> {
		await this.cartModel.insertMany(cartData);
	}

	async drop(): Promise<any> {
		await this.cartModel.deleteMany({});
	}
}
