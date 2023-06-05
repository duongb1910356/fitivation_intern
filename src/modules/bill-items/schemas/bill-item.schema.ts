import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/modules/brand/schemas/brand.schema';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { Package } from 'src/modules/package/entities/package.entity';
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
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
	brandID: Brand;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' })
	facilityID: Facility;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PackageType' })
	packageTypeID: PackageType;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Package' })
	packageID: Package;

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

	@Prop({ required: true, type: Object })
	facilityAddress: object;

	@Prop({ type: [Number], required: true, default: [] })
	facilityCoordinatesLocation: [number, number];

	@Prop({ required: true, type: String })
	facilityPhoto: string;

	@Prop({ type: [PromotionSchema] })
	promotions?: Promotion[];

	@Prop({ required: true, type: Number, min: 0 })
	packagePrice: number;

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;

	@Prop({ default: BillItemStatus.ACTIVE, enum: BillItemStatus, type: String })
	status: BillItemStatus;
}

export const BillItemSchema = SchemaFactory.createForClass(BillItem);
