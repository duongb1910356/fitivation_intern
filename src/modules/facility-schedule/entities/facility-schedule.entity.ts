import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
	OpenTime,
	OpenTimeSchema,
} from 'src/modules/facility-schedule/entities/open-time.entity';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

enum ScheduleType {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}

@Schema()
export class FacilitySchedule extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: string; //Faccility

	@Prop({ type: String, enum: ScheduleType, required: true })
	type: ScheduleType;

	@Prop({ type: [OpenTimeSchema], default: [] })
	openTime: OpenTime[];
}

export const FacilityScheduleSchema =
	SchemaFactory.createForClass(FacilitySchedule);
