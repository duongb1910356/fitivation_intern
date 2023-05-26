import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';

export type BillDocument = HydratedDocument<Bill>;

export enum PaymentMethod {
	DEBIT_CARD = 'DEBIT_CARD',
	CREDIT_CARD = 'CREDIT_CARD',
	CASH = 'CASH',
}

export enum Status {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Bill extends BaseObject {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	accountID: User;

	@Prop({
		required: true,
		type: [
			{
				packageName: { type: String },
				packageType: { type: String },
				price: { type: Number },
				promotions: { type: [String] },
			},
		],
	})
	billItems: {
		packageName: string;
		packageType: string;
		price: number;
		promotions: [string];
	}[];

	@Prop({ required: true, enum: PaymentMethod, type: String })
	paymentMethod: PaymentMethod;

	@Prop({ type: Number, default: 0 })
	taxes?: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;

	@Prop({ default: Status.ACTIVE, enum: Status, type: String })
	status: Status;

	@Prop({ type: String, minlength: 0, maxlength: 30 })
	description?: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' })
	promotion?: Promotion;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
