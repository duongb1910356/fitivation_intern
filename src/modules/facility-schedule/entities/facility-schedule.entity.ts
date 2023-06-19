import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
	OpenTime,
	OpenTimeSchema,
} from 'src/modules/facility-schedule/entities/open-time.entity';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export enum ScheduleType {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}
export type FacilityScheduleDocument = HydratedDocument<FacilitySchedule>;

@Schema({ timestamps: true })
export class FacilitySchedule extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
		required: true,
	})
	facilityID: Facility;

	@Prop({ type: String, enum: ScheduleType, required: true })
	type: ScheduleType;

	@Prop({ type: [OpenTimeSchema], default: [] })
	openTime: OpenTime[];
}

export const FacilityScheduleSchema =
	SchemaFactory.createForClass(FacilitySchedule);
