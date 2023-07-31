import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CartItemsService } from '../cart-items/cart-items.service';

@Injectable()
export class CartsService {
	constructor(
		@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
		private cartItemService: CartItemsService,
	) {}

	async createOne(userID: string): Promise<Cart> {
		const cart = await this.cartModel.create({ accountID: userID });

		if (!cart) throw new BadRequestException('Create cart failed');

		return cart;
	}

	async getCurrent(userID: string, populateOpt?: any): Promise<Cart> {
		let cart = await this.cartModel.findOne({ accountID: userID });

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

		await this.updatePrice(userID);
		await this.updatePrice(userID); // fix not return new

		cart = await this.cartModel
			.findOne({ accountID: userID })
			.populate(populateOpt);

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

		return cart;
	}

	async deleteOne(userID: string): Promise<boolean> {
		const cart = await this.cartModel.findOne({ accountID: userID });

		if (!cart) return false;

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

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

		const isDuplicateProduct = this.checkDuplicateCartItemProduct(
			cart.cartItemIDs,
			packageID,
		);

		if (isDuplicateProduct)
			throw new BadRequestException('Duplicate Product in cart');

		const cartItem = await this.cartItemService.createCartItem(packageID);

		cart.cartItemIDs.push(cartItem._id);

		cart.totalPrice += cartItem.totalPrice;

		await cart.save();

		return true;
	}

	async removeCartItemFromCurrentCart(
		userID: string,
		cartItemID: string,
	): Promise<boolean> {
		const cartItem = await this.cartItemService.findOneByID(cartItemID);

		if (!cartItem)
			throw new NotFoundException(`Not found current user's cart-item`);

		const cart = await this.cartModel
			.findOneAndUpdate(
				{ accountID: userID },
				{ $pull: { cartItemIDs: { $in: cartItemID } } },
			)
			.populate({ path: 'cartItemIDs' });

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

		cart.totalPrice -= cartItem.totalPrice;

		await cart.save();

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

	async updatePrice(userID: string): Promise<boolean> {
		const cart = await this.cartModel
			.findOne({ accountID: userID })
			.populate({ path: 'cartItemIDs' });

		const cartItemIDs: any = cart.cartItemIDs;

		let totalPrice = 0;
		for (let i = 0; i < cartItemIDs.length; i++) {
			await this.cartItemService.updatePrice(
				cartItemIDs[i]._id.toString(),
				cartItemIDs[i].promotionIDs[0],
			);
			totalPrice += cartItemIDs[i].totalPrice;
		}

		cart.totalPrice = totalPrice;
		await cart.save();

		return true;
	}

	// async addPackagePromotionToCartItemInCurrentCart(
	// 	userID: string,
	// 	cartItemID: string,
	// 	promotionID: string,
	// ): Promise<boolean> {
	// 	const cart = await this.cartModel.findOne({
	// 		accountID: userID,
	// 	});

	// 	if (!cart) throw new NotFoundException(`Not found current user's cart`);

	// 	const isValid = this.checkValidCartItemInCurrentCart(cart, cartItemID);

	// 	if (!isValid)
	// 		throw new BadRequestException(`Not found cart-item in user's cart`);

	// 	await this.cartItemService.addPackagePromotionToCartItem(
	// 		cartItemID,
	// 		promotionID,
	// 	);
	// 	return true;
	// }

	checkValidCartItemInCurrentCart(cart: Cart, cartItemID: string): boolean {
		let valid = false;

		for (let i = 0; i < cart.cartItemIDs.length; i++) {
			if (cart.cartItemIDs[i].toString() === cartItemID) {
				valid = true;
			}
		}

		return valid;
	}
}
