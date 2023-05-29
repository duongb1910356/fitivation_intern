import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
	Promotion,
	PromotionSchema,
} from 'src/modules/promotions/schemas/promotion.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type BillItemsDocument = HydratedDocument<BillItem>;

export enum BillItemStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class BillItem extends BaseObject {
	// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Package' })
	// @ApiProperty()
	// packageID: Package;

	@Prop({ required: true, type: String })
	packageName: string;

	@Prop({ required: true, type: String })
	packageType: string;

	@Prop({ required: true, type: String })
	packageDescription: string;

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

	@Prop({ type: [PromotionSchema] })
	promotions?: Promotion[];

	@Prop({ required: true, type: Number, min: 0 })
	packgePrice: number;

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;

	@Prop({ default: BillItemStatus.ACTIVE, enum: BillItemStatus, type: String })
	status: BillItemStatus;
}

export const BillItemSchema = SchemaFactory.createForClass(BillItem);
