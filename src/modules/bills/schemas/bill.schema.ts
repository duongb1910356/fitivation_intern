import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';

export type BillDocument = HydratedDocument<Bill>;

export enum PaymentMethod {
	DEBIT_CARD = 'DEBIT_CARD',
	CREDIT_CARD = 'CREDIT_CARD',
}

export enum Status {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export class Bill extends BaseObject {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	@ApiProperty()
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
	@ApiProperty()
	billItems: {
		packageName: string;
		packageType: string;
		price: number;
		promotions: [string];
	}[];

	@Prop({ required: true, enum: PaymentMethod, type: String })
	@ApiProperty()
	paymentMethod: PaymentMethod;

	@Prop({ type: Number, default: 0 })
	@ApiProperty()
	taxes?: number;

	@Prop({ required: true, type: Number, min: 0 })
	@ApiProperty()
	totalPrice: number;

	@Prop({ default: Status.ACTIVE, enum: Status, type: String })
	@ApiProperty()
	status: Status;

	@Prop({ type: String, minlength: 0, maxlength: 30 })
	@ApiProperty()
	description?: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' })
	@ApiProperty()
	promotion?: Promotion;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
