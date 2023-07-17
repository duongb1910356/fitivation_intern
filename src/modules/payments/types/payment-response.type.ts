import { Bill } from 'src/modules/bills/schemas/bill.schema';
import { Subscription } from 'src/modules/subscriptions/schemas/subscription.schema';

export class PaymentResponse {
	message?: string;
	clientSecret: string;
	paymentIntentID: string;
	bill?: Bill;
	subscription?: Subscription;
}
