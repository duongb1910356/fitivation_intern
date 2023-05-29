import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema()
export class Attendance extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	})
	accountID: string; //Account

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: string; //Faccility

	@Prop({ type: [Date] })
	date: Date[];
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
