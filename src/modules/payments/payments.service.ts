import {
	BadRequestException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { BillItemsService } from '../bill-items/bill-items.service';
import { BillsService, CreateBillOptData } from '../bills/bills.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Bill } from '../bills/schemas/bill.schema';
import { CartPaymentRequestDto } from './dto/cart-payment-request-dto';
import { CartsService } from '../carts/carts.service';
import { TokenPayload } from '../auth/types/token-payload.type';
import { CartItemsService } from '../cart-items/cart-items.service';
import Stripe from 'stripe';
import { appConfig } from 'src/app.config';
import { UsersService } from '../users/users.service';
import { PaymentMethodDto } from './dto/payment-method-dto';
import { Response } from 'express';
import { SubscriptionPaymentRequestDto } from './dto/subscription-payment-request-dto';
import { UserRole } from '../users/schemas/user.schema';
import { PaymentResponse } from './types/payment-response.type';

export enum PaymentCurrency {
	VND = 'vnd',
	USD = 'usd',
}

@Injectable()
export class PaymentsService {
	private stripe: any;

	constructor(
		private billItemService: BillItemsService,
		private billService: BillsService,
		private subscriptionService: SubscriptionsService,
		private cartService: CartsService,
		private cartItemService: CartItemsService,
		private userService: UsersService,
	) {
		this.stripe = new Stripe(`${appConfig.stripeSecretKey}`, {
			apiVersion: '2022-11-15',
		});
	}

	async purchaseSomeInCart(
		userID: string,
		cartPaymentRequestDto: CartPaymentRequestDto,
	): Promise<Bill> {
		const { cartItemIDs } = cartPaymentRequestDto;
		const cart: any = await this.cartService.getCurrent(userID, 'cartItemIDs');

		for (let i = 0; i < cartItemIDs.length; i++) {
			let isExistCartItemInCart = false;
			for (let j = 0; j < cart.cartItemIDs.length; j++) {
				if (cart.cartItemIDs[j]._id.toString() === cartItemIDs[i]) {
					isExistCartItemInCart = true;
				}
			}
			if (!isExistCartItemInCart) {
				throw new BadRequestException('Cart Item not found in current cart');
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

		const bill = await this.billService.createOne(userID, billItems, {
			description: cartPaymentRequestDto.description,
		} as CreateBillOptData);

		return bill;
	}

	async calcAmountListCartItem(cartItemIDs: string[]) {
		let amount = 0;

		for (let i = 0; i < cartItemIDs.length; i++) {
			const cartItem = await this.cartItemService.findOneByID(cartItemIDs[i]);

			amount += cartItem.totalPrice;
		}

		return amount;
	}

	async createSubscriptionPayment(
		userPayload: TokenPayload,
		subscriptionPaymentRequestDto: SubscriptionPaymentRequestDto,
	): Promise<PaymentResponse> {
		const user = await this.userService.findOneByID(userPayload.sub);

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length === 0)
			throw new NotFoundException('Customer not found');

		const subscription: any = await this.subscriptionService.findOneByID(
			subscriptionPaymentRequestDto.subscriptionID,
			userPayload,
		);
		const isExpires =
			await this.subscriptionService.checkDateAndUpdateDateIsExpired(
				subscriptionPaymentRequestDto.subscriptionID,
				userPayload,
			);

		if (isExpires.message === 'Subscription has not expired') {
			throw new BadRequestException('Subscription has not expired');
		}

		if (
			userPayload.sub.toString() !== subscription.accountID.toString() &&
			userPayload.role === UserRole.MEMBER
		) {
			throw new ForbiddenException('Forbidden resource');
		}

		const amount = subscription.packageID.price;

		const paymentIntent = await this.stripe.paymentIntents.create({
			amount,
			currency: PaymentCurrency.VND,
			customer: stripeCustomer.data[0].id,
			metadata: {
				subscriptionID: subscriptionPaymentRequestDto.subscriptionID,
			},
			description:
				subscriptionPaymentRequestDto.description || 'Subscription payment',
		});

		return {
			message: 'Require confirm payment to complete',
			clientSecret: paymentIntent.client_secret,
			paymentIntentID: paymentIntent.id,
		};
	}

	async createCartPayment(
		paymentRequest: CartPaymentRequestDto,
		userID: string,
	): Promise<PaymentResponse> {
		const user = await this.userService.findOneByID(userID);

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length === 0)
			throw new NotFoundException('Customer not found');

		const cart: any = await this.cartService.getCurrent(userID, 'cartItemIDs');

		for (let i = 0; i < paymentRequest.cartItemIDs.length; i++) {
			let isExistCartItemInCart = false;
			for (let j = 0; j < cart.cartItemIDs.length; j++) {
				if (
					cart.cartItemIDs[j]._id.toString() === paymentRequest.cartItemIDs[i]
				) {
					isExistCartItemInCart = true;
				}
			}
			if (!isExistCartItemInCart) {
				throw new BadRequestException('Cart Item not found in current cart');
			}
		}

		const amount = await this.calcAmountListCartItem(
			paymentRequest.cartItemIDs,
		);

		const paymentIntent = await this.stripe.paymentIntents.create({
			amount,
			currency: PaymentCurrency.VND,
			customer: stripeCustomer.data[0].id,
			metadata: {
				cartItemIDs: paymentRequest.cartItemIDs.join(', '),
			},
			description: paymentRequest.description || 'Cart payment',
		});

		return {
			message: 'Require confirm payment to complete',
			clientSecret: paymentIntent.client_secret,
			paymentIntentID: paymentIntent.id,
		};
	}

	async confirmPayment(
		paymentIntentID: string,
		paymentMethod: PaymentMethodDto,
		userPayload: TokenPayload,
		response: Response,
	): Promise<void> {
		const paymentIntent = await this.stripe.paymentIntents.retrieve(
			paymentIntentID,
		);

		const customer = await this.stripe.customers.retrieve(
			paymentIntent.customer,
		);

		const user = await this.userService.findOneByID(userPayload.sub);

		if (customer.email !== user.email) {
			throw new ForbiddenException(
				'This payment does not belong to current user',
			);
		}

		await this.stripe.paymentIntents
			.confirm(paymentIntentID, {
				payment_method: paymentMethod.paymentMethod,
			})
			.then(async (paymentIntent: any) => {
				if (paymentIntent.metadata.cartItemIDs !== undefined) {
					const cartItemIDs = JSON.stringify(paymentIntent.metadata.cartItemIDs)
						.replace(/"/g, '')
						.split(', ');

					const bill = await this.purchaseSomeInCart(userPayload.sub, {
						cartItemIDs,
						description: paymentIntent.description,
					} as CartPaymentRequestDto);

					await this.billService.updatePaymentMethod(
						bill._id.toString(),
						paymentMethod,
					);

					await this.stripe.paymentIntents.update(paymentIntent.id, {
						metadata: { billID: bill._id.toString(), cartItemIDs: null },
					});

					for (let i = 0; i < cartItemIDs.length; i++) {
						await this.cartService.removeCartItemFromCurrentCart(
							userPayload.sub,
							cartItemIDs[i],
						);
					}

					response.status(HttpStatus.OK).json({
						message: 'Payment successful',
						clientSecret: paymentIntent.client_secret,
						paymentIntentID: paymentIntent.id,
						bill: await this.billService.findOneByID(
							bill._id.toString(),
							userPayload,
						),
					} as PaymentResponse);
				} else if (paymentIntent.metadata.subscriptionID !== undefined) {
					const subscription: any = await this.subscriptionService.findOneByID(
						paymentIntent.metadata.subscriptionID,
						userPayload,
					);

					const billItem = await this.billItemService.createOne(
						subscription.packageID._id.toString(),
						userPayload.sub,
					);

					const billItems = [];

					billItems.push(billItem);

					const bill = await this.billService.createOne(
						userPayload.sub,
						billItems,
						{ description: paymentIntent.description },
					);

					await this.billService.updatePaymentMethod(
						bill._id.toString(),
						paymentMethod,
					);

					await this.stripe.paymentIntents.update(paymentIntent.id, {
						metadata: { billID: bill._id.toString() },
					});

					await this.subscriptionService.renew(
						paymentIntent.metadata.subscriptionID,
						bill.billItems[0]._id.toString(),
						userPayload,
					);

					response.status(HttpStatus.OK).json({
						message: 'Payment successful',
						clientSecret: paymentIntent.client_secret,
						paymentIntentID: paymentIntent.id,
						bill: await this.billService.findOneByID(
							bill._id.toString(),
							userPayload,
						),
					} as PaymentResponse);
				}
			})
			.catch(async (err) => {
				response
					.status(HttpStatus.BAD_REQUEST)
					.json({ statusCode: err.statusCode, message: err.message });
			});
	}
}
