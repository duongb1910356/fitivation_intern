import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
	@ApiProperty()
	targetId: string;

	@Prop({ required: true, enum: Type, type: String })
	@ApiProperty()
	type: Type;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	@ApiProperty()
	name: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	@ApiProperty()
	description: string;

	@Prop({ type: String, minlength: 2, maxlength: 10 })
	@ApiProperty()
	couponCode?: string;

	@Prop({ required: true, type: Number })
	@ApiProperty()
	value: number;

	@Prop({ required: true, enum: Status, type: String })
	@ApiProperty()
	methods: Method;

	@Prop({ required: true, type: Number, min: 0 })
	@ApiProperty()
	maxValue: number;

	@Prop({ type: Number, min: 0 })
	@ApiProperty()
	maxQuantity?: number;

	@Prop({ required: true, type: Date, default: Date.now() })
	@ApiProperty()
	startDate: Date;

	@Prop({ required: true, type: Date })
	@ApiProperty()
	endDate: Date;

	@Prop({ enum: Status, default: CustomerType.CUSTOMER, type: String })
	@ApiProperty()
	customerType: CustomerType;

	@Prop({ enum: Status, default: Status.ACTIVE, type: String })
	@ApiHideProperty()
	status: Status;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
