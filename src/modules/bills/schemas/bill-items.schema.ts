import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type BillItemsDocument = HydratedDocument<BillItems>;

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
export class BillItems extends BaseObject {
	@Prop({ required: true, type: String })
	packageName: string;

	@Prop({ required: true, type: String })
	packageType: string;

	@Prop({ required: true, type: String })
	packageDescription: string;

	@Prop({ required: true, type: Number })
	packgePrice: number;

	@Prop({ type: [Promotion], default: [] })
	promotions: Promotion[];

	@Prop({ required: true, type: String })
	brandName: string;

	@Prop({ required: true, type: String })
	ownerFacilityName: string;

	@Prop({ required: true, type: String })
	facilityName: string;

	// @Prop({ required: true, type: Object })
	// facilityAddress: Address;

	@Prop({ type: [Number], required: true, default: [] })
	facilityCoordinatesLocation: [number, number];

	@Prop({ required: true, type: String })
	facilityPhoto: string;
}

export const BillItemsSchema = SchemaFactory.createForClass(BillItems);
