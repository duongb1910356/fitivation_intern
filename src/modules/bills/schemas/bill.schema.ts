import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import {
	Promotion,
	PromotionSchema,
} from 'src/modules/promotions/schemas/promotion.schema';
import { BillItem } from '../../bill-items/schemas/bill-item.schema';

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
	accountID: string;

	@Prop({
		required: true,
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'BillItem',
	})
	billItems: BillItem[];

	@Prop({ required: true, enum: PaymentMethod, type: String })
	paymentMethod: PaymentMethod;

	@Prop({ type: Number, default: 0, min: 0 })
	taxes?: number;

	@Prop({ type: String, minlength: 0, maxlength: 200 })
	description?: string;

	@Prop({ type: [PromotionSchema] })
	promotions?: Promotion[];

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ default: 0, type: Number, min: 0 })
	totalPrice: number;

	@Prop({ default: BillStatus.ACTIVE, enum: BillStatus, type: String })
	status: BillStatus;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
