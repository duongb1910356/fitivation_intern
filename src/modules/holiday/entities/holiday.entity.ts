import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema()
export class Holiday extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: string; //Faccility

	@Prop({ type: Date, required: true })
	startDate: Date;

	@Prop({ type: Date, required: true })
	endDate: Date;

	@Prop({ type: String })
	content: string;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);