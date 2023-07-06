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
import {
	ListResponse,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import { PaymentOptDto } from './dto/payment-options-dto';

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

	async findMany(query: QueryObject): Promise<ListResponse<Cart>> {
		const queryFeatures = new QueryAPI(this.cartModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		const carts = await queryFeatures.queryModel;

		return {
			total: carts.length,
			queryOptions: queryFeatures.queryOptions,
			items: carts,
		};
	}

	async findOneByID(cartID: string): Promise<Cart> {
		const cart = await this.cartModel.findById(cartID);

		if (!cart) throw new NotFoundException('Not found user with that ID');

		return cart;
	}

	async createOne(userID: string): Promise<Cart> {
		const cart = await this.cartModel.create({ accountID: userID });

		if (!cart) throw new BadRequestException('Create cart failed');

		return cart;
	}

	async getCurrent(userID: string, populateOpt?: any): Promise<Cart> {
		await this.updatePrice(userID);
		await this.updatePrice(userID);

		const cart = await this.cartModel
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

		const cart = await this.cartModel
			.findOneAndUpdate(
				{ accountID: userID },
				{ $pull: { cartItemIDs: { $in: cartItemID } } },
			)
			.populate({ path: 'cartItemIDs' });

		if (!cart) throw new NotFoundException(`Not found current user's cart`);
		console.log(cart.totalPrice, cartItem.totalPrice);

		cart.totalPrice -= cartItem.totalPrice;

		await cart.save();

		await this.cartItemService.deleteOne(cartItemID);

		return true;
	}

	async purchaseInCart(
		userID: string,
		paymentOpt: PaymentOptDto,
	): Promise<Bill> {
		// ...check payment

		const cart = await this.getCurrent(userID, 'cartItemIDs');

		if (cart.cartItemIDs.length === 0)
			throw new BadRequestException('Have at least one cart-item in cart');

		const cartItemIDs: any = cart.cartItemIDs;
		const packageIDs = [];
		const billItems = [];

		for (let i = 0; i < cartItemIDs.length; i++) {
			packageIDs.push(cartItemIDs[i].packageID.toString());
		}

		for (let i = 0; i < packageIDs.length; i++) {
			billItems.push(
				await this.billItemService.createOne(packageIDs[i], userID),
			);

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

		let totalPrice = 0;
		for (let i = 0; i < cartItemIDs.length; i++) {
			await this.cartItemService.updatePrice(
				cartItemIDs[i]._id.toString(),
				cartItemIDs[i].promotionIDs[0],
			);
		}

		for (let i = 0; i < cartItemIDs.length; i++) {
			totalPrice += cartItemIDs[i].totalPrice;
		}

		cart.totalPrice = totalPrice;
		await cart.save();

		return true;
	}

	async addPackagePromotionToCartItemInCurrentCart(
		userID: string,
		cartItemID: string,
		promotionID: string,
	): Promise<boolean> {
		const cart = await this.cartModel.findOne({
			accountID: userID,
		});

		if (!cart) throw new NotFoundException(`Not found current user's cart`);

		const isValid = this.checkValidCartItemInCurrentCart(cart, cartItemID);

		if (!isValid)
			throw new BadRequestException(`Not found cart-item in user's cart`);

		await this.cartItemService.addPackagePromotionToCartItem(
			cartItemID,
			promotionID,
		);
		return true;
	}

	checkValidCartItemInCurrentCart(cart: Cart, cartItemID: string) {
		let valid = false;

		for (let i = 0; i < cart.cartItemIDs.length; i++) {
			if (cart.cartItemIDs[i].toString() === cartItemID) {
				valid = true;
			}
		}

		return valid;
	}
}
