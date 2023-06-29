import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CartItemsService } from '../cart-items/cart-items.service';
import { BillItemsService } from '../bill-items/bill-items.service';
import { BillsService } from '../bills/bills.service';
import { Bill } from '../bills/schemas/bill.schema';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PackageService } from '../package/package.service';

@Injectable()
export class CartsService {
	constructor(
		@InjectModel(Cart.name) private cartModel: Model<CartDocument>,
		private cartItemService: CartItemsService,
		private billItemService: BillItemsService,
		private billService: BillsService,
		private subscriptionService: SubscriptionsService,
		private packageService: PackageService,
	) {}

	async createOne(userID: string): Promise<Cart> {
		const cart = await this.cartModel.create({ accountID: userID });

		if (!cart) throw new BadRequestException('Create cart failed');

		return cart;
	}

	async getCurrent(userID: string, populateOpt?: any): Promise<Cart> {
		const cart = await this.cartModel
			.findOne({ accountID: userID })
			.populate(populateOpt);

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

		await this.updatePrice(userID);

		return cart;
	}

	async deleteOne(userID: string): Promise<boolean> {
		const cart = await this.cartModel.findOne({ accountID: userID });

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

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

		if (!cart) throw new NotFoundException(`Not found current user's cart`);
		console.log(cart.totalPrice, cartItem.totalPrice);

		cart.totalPrice -= cartItem.totalPrice;

		cart.save();

		await this.cartItemService.deleteOne(cartItemID);

		return true;
	}

	async purchaseInCart(userID: string, paymentOpt: any): Promise<Bill> {
		// ...check payment

		const cart = await this.getCurrent(userID, 'cartItemIDs');
		const cartItemIDs: any = cart.cartItemIDs;
		const packageIDs = [];
		const billItems = [];

		for (let i = 0; i < cartItemIDs.length; i++) {
			packageIDs.push(cartItemIDs[i].packageID.toString());
		}

		for (let i = 0; i < packageIDs.length; i++) {
			billItems.push(await this.billItemService.createOne(packageIDs[i]));

			const facilityID = (await this.packageService.findOneByID(packageIDs[i]))
				.facilityID;

			await this.subscriptionService.createOne(
				userID,
				billItems[i]._id.toString(),
				packageIDs[i].toString(),
				facilityID.toString(),
			);
		}

		const bill = await this.billService.createOne(
			userID,
			billItems,
			paymentOpt,
		);

		for (let i = 0; i < cartItemIDs.length; i++) {
			await this.removeCartItemFromCurrentCart(userID, cartItemIDs[i]);
		}
		return bill;
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

		if (cartItemIDs.length === 0)
			throw new BadRequestException('Have at least one cart-item in cart');

		let totalPrice = 0;
		for (let i = 0; i < cartItemIDs.length; i++) {
			await this.cartItemService.updatePrice(cartItemIDs[i]._id.toString());
		}

		for (let i = 0; i < cartItemIDs.length; i++) {
			totalPrice += cartItemIDs[i].totalPrice;
		}
		cart.totalPrice = totalPrice;
		cart.save();

		return true;
	}
}
