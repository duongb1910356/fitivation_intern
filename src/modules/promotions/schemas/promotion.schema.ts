import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type PromotionDocument = HydratedDocument<Promotion>;

export enum Type {
	FACILITY = 'FACILITY',
	BILL = 'BILL',
	PACKAGE = 'PACKAGE',
}

export enum Method {
	PERCENT = 'PERCENT',
	NUMBER = 'NUMBER',
}

export enum CustomerType {
	CUSTOMER = 'CUSTOMER',
	MEMBER = 'MEMBER',
}

export enum Status {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Promotion extends BaseObject {
	@Prop({ required: true, type: String })
	targetId: string;

	@Prop({ required: true, enum: Type, type: String })
	type: Type;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	name: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	description: string;

	@Prop({ type: String, minlength: 2, maxlength: 10 })
	couponCode?: string;

	@Prop({ required: true, type: Number })
	value: number;

	@Prop({ required: true, enum: Status, type: String })
	methods: Method;

	@Prop({ required: true, type: Number, min: 0 })
	maxValue: number;

	@Prop({ type: Number, min: 0 })
	maxQuantity?: number;

	@Prop({ required: true, type: Date, default: Date.now() })
	startDate: Date;

	@Prop({ required: true, type: Date })
	endDate: Date;

	@Prop({ enum: Status, default: CustomerType.CUSTOMER, type: String })
	customerType: CustomerType;

	@Prop({ enum: Status, default: Status.ACTIVE, type: String })
	status: Status;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
