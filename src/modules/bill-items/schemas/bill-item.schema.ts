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
import { BillItemFacility } from './bill-item-facility.schema';
import { BillItemPackage } from './bill-item-package.schema';
import { BillItemPackageType } from './bill-item-package-type.schema';

export type BillItemsDocument = HydratedDocument<BillItem>;

export enum BillItemStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class BillItem extends BaseObject {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
	brandID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
	})
	facilityID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PackageType',
	})
	packageTypeID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Package',
	})
	packageID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	ownerFacilityID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	accountID: string;

	@Prop({
		required: true,
		type: BillItemFacility,
	})
	facilityInfo: BillItemFacility;

	@Prop({
		required: true,
		type: BillItemPackageType,
	})
	packageTypeInfo: BillItemPackageType;

	@Prop({
		required: true,
		type: BillItemPackage,
	})
	packageInfo: BillItemPackage;

	@Prop({ default: 0, type: [PromotionSchema] })
	promotions?: Promotion[];

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice?: number;

	@Prop({ default: 0, type: Number, min: 0 })
	totalPrice?: number;

	@Prop({ default: BillItemStatus.ACTIVE, enum: BillItemStatus, type: String })
	status: BillItemStatus;
}

export const BillItemSchema = SchemaFactory.createForClass(BillItem);
