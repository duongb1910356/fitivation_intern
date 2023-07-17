import { Bill } from 'src/modules/bills/schemas/bill.schema';

export class PaymentResponse {
	message?: string;
	clientSecret: string;
	paymentIntentID: string;
	bill?: Bill;
}
