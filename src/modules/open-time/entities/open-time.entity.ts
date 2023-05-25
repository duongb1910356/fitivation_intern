import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum dayOfWeek {
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
	SUNDAY,
}

@Schema()
export class OpenTime {
	@Prop({
		type: {
			startTime: { type: Date, required: true },
			endTime: { type: Date, required: true },
		},
		required: true,
	})
	shift: { startTime: Date; endTime: Date };

	@Prop({
		enum: dayOfWeek,
		type: String,
	})
	dayOfWeek?: dayOfWeek;

	@Prop({
		type: Number,
		validate: {
			validator: (value: number) => value >= 1 && value <= 31,
			message: 'Day of month must be between 1 and 31',
		},
	})
	dayofMoth?: number;
}

export const OpenTimeSchema = SchemaFactory.createForClass(OpenTime);

//sort khi pre save
