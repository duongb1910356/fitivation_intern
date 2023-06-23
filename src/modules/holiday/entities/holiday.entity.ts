import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type HolidayDocument = HydratedDocument<Holiday>;

@Schema({ timestamps: true })
export class Holiday extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: Facility;

	@Prop({ type: Date, required: true })
	startDate: Date;

	@Prop({ type: Date, required: true })
	endDate: Date;

	@Prop({ type: String })
	content?: string;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);
