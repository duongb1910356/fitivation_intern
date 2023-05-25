import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema()
export class Attendance extends BaseObject {
	// @Prop({ type: AccountSchema, required: true })
	// accountID: Account;

	// @Prop({ type: FacilitySchema, required: true })
	// facilityID: Facility;

	@Prop({ type: [{ type: Date }] })
	date: Date[];
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
