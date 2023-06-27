import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PackageService } from '../package/package.service';
import { CartItemsService } from '../cart-items/cart-items.service';

@Injectable()
export class CartsService {
	constructor(
		@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
		private packageService: PackageService,
		private cartItemService: CartItemsService,
	) {}

	async createCart(userID: string): Promise<Cart> {
		const cart = await this.cartModel.create({ accountID: userID });

		return cart;
	}

	async getCurrent(userID: string): Promise<Cart> {
		const cart = await this.cartModel
			.findOne({ accountID: userID })
			.populate({ path: 'cartItemIDs' });

		if (!cart) throw new BadRequestException(`Not found current user's cart`);

		return cart;
	}

	async deleteOne(userID: string): Promise<boolean> {
		const cart = await this.cartModel.findOne({ accountID: userID });

		if (!cart) throw new BadRequestException(`Not found current user's cart`);

		const cartItems = cart.cartItemIDs;

		cartItems.forEach(async (el) => await this.cartItemService.deleteOne(el));

		await this.cartModel.deleteOne({ accountID: userID });

		return true;
	}

	async addCartItemToCurrentCart(
		userID: string,
		packageID: string,
	): Promise<boolean> {
		const cart = await this.cartModel
			.findOne({ accountID: userID })
			.populate({ path: 'cartItemIDs' });

		if (!cart) throw new BadRequestException(`Not found current user's cart`);

		const isDuplicateProduct = this.checkDuplicateCartItemProduct(
			cart.cartItemIDs,
			packageID,
		);

		if (isDuplicateProduct)
			throw new BadRequestException('Duplicate Product in cart');

		const cartItem = await this.cartItemService.createCartItem(packageID);

		cart.cartItemIDs.push(cartItem._id);

		cart.totalPrice += cartItem.totalPrice;

		cart.save();

		return true;
	}

	async removeCartItemFromCurrentCart(
		userID: string,
		cartItemID: string,
	): Promise<boolean> {
		const cartItem = await this.cartItemService.findOne(cartItemID);

		const cart = await this.cartModel
			.findOneAndUpdate(
				{ accountID: userID },
				{ $pull: { cartItemIDs: { $in: cartItemID } } },
			)
			.populate({ path: 'cartItemIDs' });

		if (!cart) throw new BadRequestException(`Not found current user's cart`);
		console.log(cart.totalPrice, cartItem.totalPrice);

		cart.totalPrice -= cartItem.totalPrice;

		cart.save();

		await this.cartItemService.deleteOne(cartItemID);

		return true;
	}

	checkDuplicateCartItemProduct(cartItems: any[], productID: string): boolean {
		let isDuplicate = false;
		for (let i = 0; i < cartItems.length; i++) {
			if (cartItems[i].packageID.toString() === productID) isDuplicate = true;
		}
		return isDuplicate;
	}
}
