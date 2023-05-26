import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class ShiftTime {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: string; //Faccility

	@Prop({ type: Date })
	startTime: Date;

	@Prop({ type: Date })
	endTime: Date;
}

export const ShiftTimeSchema = SchemaFactory.createForClass(ShiftTime);
