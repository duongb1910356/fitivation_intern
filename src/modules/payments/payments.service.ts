import { BadRequestException, Injectable } from '@nestjs/common';
import { BillItemsService } from '../bill-items/bill-items.service';
import { BillsService } from '../bills/bills.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PackageService } from '../package/package.service';
import { Bill } from '../bills/schemas/bill.schema';
import { PaymentOptDto } from './dto/payment-options-dto';
import { CartsService } from '../carts/carts.service';
import { TokenPayload } from '../auth/types/token-payload.type';
import { Subscription } from '../subscriptions/schemas/subscription.schema';
import { PaymentOptWithCartItemIDsDto } from './dto/payment-option-with-cartItemID-dto';
import { CartItemsService } from '../cart-items/cart-items.service';

@Injectable()
export class PaymentsService {
	constructor(
		private billItemService: BillItemsService,
		private billService: BillsService,
		private subscriptionService: SubscriptionsService,
		private packageService: PackageService,
		private cartService: CartsService,
		private cartItemService: CartItemsService,
	) {}

	async purchaseAllInCart(
		userID: string,
		paymentOpt: PaymentOptDto,
	): Promise<Bill> {
		// ...check payment

		const cart = await this.cartService.getCurrent(userID, 'cartItemIDs');

		if (cart.cartItemIDs.length === 0)
			throw new BadRequestException('Have at least one cart-item in cart');

		const cartItemIDs: any = cart.cartItemIDs;
		const packageIDs = [];
		const billItems = [];

		for (let i = 0; i < cartItemIDs.length; i++) {
			packageIDs.push(cartItemIDs[i].packageID.toString());
		}

		for (let i = 0; i < packageIDs.length; i++) {
			const billItem = await this.billItemService.createOne(
				packageIDs[i],
				userID,
			);

			billItems.push(billItem);

			await this.subscriptionService.createOne(
				userID,
				billItem._id.toString(),
				billItem.packageID.toString(),
				billItem.facilityID.toString(),
			);
		}

		const bill = await this.billService.createOne(
			userID,
			billItems,
			paymentOpt,
		);

		for (let i = 0; i < cartItemIDs.length; i++) {
			await this.cartService.removeCartItemFromCurrentCart(
				userID,
				cartItemIDs[i],
			);
		}
		return bill;
	}

	async purchaseSomeInCart(
		userID: string,
		paymentOptWithCartItemIDsDto: PaymentOptWithCartItemIDsDto,
	) {
		const { cartItemIDs } = paymentOptWithCartItemIDsDto;
		const cart: any = await this.cartService.getCurrent(userID, 'cartItemIDs');

		for (let i = 0; i < cartItemIDs.length; i++) {
			let isExistCartItemInCart = false;
			for (let j = 0; j < cart.cartItemIDs.length; j++) {
				if (cart.cartItemIDs[j]._id.toString() === cartItemIDs[i]) {
					isExistCartItemInCart = true;
				}
			}
			if (!isExistCartItemInCart) {
				throw new BadRequestException('Cart Item not found in cart');
			}
		}

		const cartItemIDsObject = [];
		const billItems = [];

		for (let i = 0; i < cartItemIDs.length; i++) {
			cartItemIDsObject.push(
				await this.cartItemService.findOneByID(cartItemIDs[i]),
			);
		}

		for (let i = 0; i < cartItemIDsObject.length; i++) {
			const billItem = await this.billItemService.createOne(
				cartItemIDsObject[i].packageID._id.toString(),
				userID,
			);
			billItems.push(billItem);

			await this.subscriptionService.createOne(
				userID,
				billItem._id.toString(),
				billItem.packageID.toString(),
				billItem.facilityID.toString(),
			);
		}

		const bill = await this.billService.createOne(
			userID,
			billItems,
			paymentOptWithCartItemIDsDto,
		);

		return bill;
	}

	async renew(
		subscriptionID: string,
		user: TokenPayload,
		paymentOpt: PaymentOptDto,
	): Promise<Subscription> {
		const subscription: any = await this.subscriptionService.findOneByID(
			subscriptionID,
			user,
		);

		const billItem = await this.billItemService.createOne(
			subscription.packageID._id.toString(),
			user.sub,
		);

		const billItems = [];

		billItems.push(billItem);

		await this.billService.createOne(user.sub, billItems, paymentOpt);

		return await this.subscriptionService.renew(
			subscriptionID,
			billItem._id.toString(),
			user,
		);
	}
}
