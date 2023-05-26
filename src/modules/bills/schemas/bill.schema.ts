import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

export enum BillStatus {
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

	@Prop({ type: [BillItems] })
	billItems: BillItems[];

	@Prop({ required: true, enum: PaymentMethod, type: String })
	paymentMethod: PaymentMethod;

	@Prop({ type: Number, default: 0, min: 0 })
	taxes?: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;

	@Prop({ default: BillStatus.ACTIVE, enum: BillStatus, type: String })
	status: BillStatus;

	@Prop({ type: String, minlength: 0, maxlength: 200 })
	description?: string;

	@Prop({ type: [Promotion] })
	promotions?: Promotion[];

	@Prop({ type: Number, min: 0 })
	totalPromotionPrice?: number;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
