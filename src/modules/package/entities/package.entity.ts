import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

enum TimeType {
	ONE_MONTH = '1',
	TWO_MONTH = '2',
	THREE_MONTH = '3',
	SIX_MONTH = '6',
	TWELVE_MONTH = '12',
}

@Schema()
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
	facilityID: string; //Facility

	@Prop({ type: String, enum: TimeType, required: true })
	type: TimeType;

	@Prop({ type: Number, required: true })
	price: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
