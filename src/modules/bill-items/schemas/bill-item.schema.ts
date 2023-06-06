import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/modules/brand/schemas/brand.schema';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { Package, TimeType } from 'src/modules/package/entities/package.entity';
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
	@Prop({
		type: {
			facilityID: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
			brandID: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
			brandName: { type: String },
			ownerFacilityName: { type: String },
			facilityName: { type: String },
			facilityAddress: { type: Object },
			facilityCoordinatesLocation: {
				type: [Number],
				required: true,
				default: [],
			},
			facilityPhoto: { default: '', type: String },
		},
	})
	facilityInfo: {
		facilityID: Facility;
		brandID: Brand;
		brandName: string;
		ownerFacilityName: string;
		facilityName: string;
		facilityAddress: object;
		facilityCoordinatesLocation: [number, number];
		facilityPhoto: string;
	};

	@Prop({
		type: {
			packageTypeID: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'PackageType',
			},
			name: { type: String },
			description: { type: String },
			price: { type: Number, min: 0 },
		},
	})
	packageTypeInfo: {
		packageTypeID: PackageType;
		name: string;
		desctiption?: string;
		price: number;
	};

	@Prop({
		type: {
			packageID: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Package',
			},
			type: { enum: TimeType, type: String },
			price: { type: Number, min: 0 },
		},
	})
	packageInfo: {
		packageID: Package;
		type: TimeType;
		price: number;
	};

	@Prop({ type: [PromotionSchema] })
	promotions?: Promotion[];

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;

	@Prop({ default: BillItemStatus.ACTIVE, enum: BillItemStatus, type: String })
	status: BillItemStatus;
}

export const BillItemSchema = SchemaFactory.createForClass(BillItem);
