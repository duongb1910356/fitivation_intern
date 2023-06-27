import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartsService {
	constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

	async createCart(userID: string): Promise<Cart> {
		const cart = await this.cartModel.create({ accountID: userID });

		return cart;
	}

	async getCurrent(userID: string): Promise<Cart> {
		const cart = await this.cartModel.findOne({ accountID: userID });

		if (!cart) throw new BadRequestException(`Not found user's cart`);

		return cart;
	}

	async deleteOne(userID: string): Promise<boolean> {
		await this.cartModel.deleteOne({ accountID: userID });

		return true;
	}
}
