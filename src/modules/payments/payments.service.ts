import {
	BadRequestException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { BillItemsService } from '../bill-items/bill-items.service';
import { BillsService } from '../bills/bills.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PaymentStatus } from '../bills/schemas/bill.schema';
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
	private stripe;

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
	) {
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

		const bill = await this.billService.createOne(
			userID,
			billItems,
			cartPaymentRequestDto,
		);

		return bill;
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

		const billItem = await this.billItemService.createOne(
			subscription.packageID._id.toString(),
			userPayload.sub,
		);

		const billItems = [];

		billItems.push(billItem);

		const bill = await this.billService.createOne(
			userPayload.sub,
			billItems,
			subscriptionPaymentRequestDto,
		);

		const paymentIntent = await this.stripe.paymentIntents.create({
			amount: bill.totalPrice,
			currency: PaymentCurrency.VND,
			customer: stripeCustomer.data[0].id,
			metadata: {
				subscriptionID: subscriptionPaymentRequestDto.subscriptionID,
				billID: bill._id.toString(),
			},
			description:
				subscriptionPaymentRequestDto.description || 'Subscription payment',
		});

		return {
			message: 'Require confirm payment to complete',
			clientSecret: paymentIntent.client_secret,
			paymentIntentID: paymentIntent.id,
			bill,
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

		const bill = await this.purchaseSomeInCart(userID, paymentRequest);

		const paymentIntent = await this.stripe.paymentIntents.create({
			amount: bill.totalPrice,
			currency: PaymentCurrency.VND,
			customer: stripeCustomer.data[0].id,
			metadata: {
				billID: bill._id.toString(),
				cartItemIDs: paymentRequest.cartItemIDs.join(', '),
			},
			description: paymentRequest.description || 'Cart payment',
		});

		return {
			message: 'Require confirm payment to complete',
			clientSecret: paymentIntent.client_secret,
			paymentIntentID: paymentIntent.id,
			bill,
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
			.then(async (res) => {
				if (paymentIntent.metadata.cartItemIDs !== undefined) {
					const cartItemIDs = JSON.stringify(paymentIntent.metadata.cartItemIDs)
						.replace(/"/g, '')
						.split(',');

					for (let i = 0; i < cartItemIDs.length; i++) {
						await this.cartService.removeCartItemFromCurrentCart(
							userPayload.sub,
							cartItemIDs[i],
						);
					}
				}
				await this.billService.updatePaymentStatus(
					paymentIntent.metadata.billID,
					PaymentStatus.SUCCEEDED,
				);

				await this.billService.updatePaymentMethod(
					paymentIntent.metadata.billID,
					paymentMethod,
				);

				if (paymentIntent.metadata.subscriptionID !== undefined) {
					await this.subscriptionService.renew(
						paymentIntent.metadata.subscriptionID,
						paymentIntent.metadata.billID,
						userPayload,
					);
				}

				response.status(HttpStatus.OK).json({
					message: 'Payment successful',
					clientSecret: res.client_secret,
					paymentIntentID: res.id,
					bill: await this.billService.findOneByID(
						paymentIntent.metadata.billID,
						userPayload,
					),
				} as PaymentResponse);
			})
			.catch(async (err) => {
				await this.billService.deleteOneByID(paymentIntent.metadata.billID);

				response
					.status(HttpStatus.BAD_REQUEST)
					.json({ statusCode: err.statusCode, message: err.message });
			});
	}
}
