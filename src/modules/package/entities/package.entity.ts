import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export enum TimeType {
	ONE_MONTH = '1',
	TWO_MONTH = '2',
	THREE_MONTH = '3',
	SIX_MONTH = '6',
	TWELVE_MONTH = '12',
}

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true })
export class Package extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PackageType',
		required: true,
	})
	packageTypeID: PackageType;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: Facility;

	@Prop({ type: String, enum: TimeType, required: true })
	type: TimeType;

	@Prop({ type: Number, min: 0, required: true })
	price: number;

	@Prop({ type: [String] })
	benefits: string[];
}

export const PackageSchema = SchemaFactory.createForClass(Package);
