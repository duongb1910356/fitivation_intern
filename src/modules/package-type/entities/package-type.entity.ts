import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema()
export class PackageType extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: Facility;

	@Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
	name: string;

	@Prop({ type: String, required: true })
	description: string;

	@Prop({ type: Number, min: 0, required: true })
	price: number;

	@Prop({ type: Number, required: true })
	order: number;
}

export const PackageTypeSchema = SchemaFactory.createForClass(PackageType);
