import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema()
export class Attendance extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	})
	accountID: User;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: Facility;

	@Prop({ type: [Date] })
	date: Date[];
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
