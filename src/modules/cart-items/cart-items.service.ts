import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';
import { Model } from 'mongoose';
import { PackageService } from '../package/package.service';

@Injectable()
export class CartItemsService {
	constructor(
		@InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
		private packgeService: PackageService,
	) {}

	async findOne(cartItemID: string): Promise<CartItem> {
		const cartItem = await this.cartItemModel.findOne({ _id: cartItemID });

		if (!cartItem) throw new BadRequestException(`Not found cart-item`);

		return cartItem;
	}

	async createCartItem(packageID: string): Promise<CartItem> {
		const packageItem = await this.packgeService.findOneByID(packageID);

		const cartItem = await this.cartItemModel.create({ packageID: packageID });

		if (!cartItem) throw new BadRequestException(`Create cart-item failed`);

		cartItem.totalPrice = packageItem.price;

		cartItem.save();

		return cartItem;
	}

	async deleteOne(cartItemID: string): Promise<boolean> {
		const cartItem = await this.cartItemModel.findById(cartItemID);

		if (!cartItem)
			throw new BadRequestException('Not found cart-item with that ID');

		await this.cartItemModel.deleteOne({ _id: cartItemID });

		return true;
	}
}
