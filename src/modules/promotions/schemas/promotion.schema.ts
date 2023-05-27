import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type PromotionDocument = HydratedDocument<Promotion>;

export enum PromotionType {
	FACILITY = 'FACILITY',
	BILL = 'BILL',
	PACKAGE = 'PACKAGE',
}

export enum PromotionMethod {
	PERCENT = 'PERCENT',
	NUMBER = 'NUMBER',
}

export enum CustomerType {
	CUSTOMER = 'CUSTOMER',
	MEMBER = 'MEMBER',
}

export enum PromotionStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Promotion extends BaseObject {
	@Prop({ required: true, type: String, maxlength: 12 })
	targetId: string;

	@Prop({ required: true, enum: PromotionType, type: String })
	type: PromotionType;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	name: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 120 })
	description: string;

	@Prop({ type: String, minlength: 2, maxlength: 10 })
	couponCode?: string;

	@Prop({ required: true, type: Number })
	value: number;

	@Prop({ required: true, enum: PromotionMethod, type: String })
	method: PromotionMethod;

	@Prop({ required: true, type: Number, min: 0 })
	maxValue: number;

	@Prop({ type: Number, min: 0 })
	maxQuantity?: number;

	@Prop({ required: true, type: Date, default: Date.now() })
	startDate: Date;

	@Prop({ required: true, type: Date })
	endDate: Date;

	@Prop({ enum: CustomerType, default: CustomerType.CUSTOMER, type: String })
	customerType: CustomerType;

	@Prop({
		enum: PromotionStatus,
		default: PromotionStatus.ACTIVE,
		type: String,
	})
	status: PromotionStatus;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
