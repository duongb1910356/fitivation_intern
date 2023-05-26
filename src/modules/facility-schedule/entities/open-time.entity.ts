import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ShiftTime, ShiftTimeSchema } from './shift-time.entity';

enum dayOfWeek {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY',
}

@Schema()
export class OpenTime {
	@Prop({ type: ShiftTimeSchema })
	shift: ShiftTime;

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
	dayOfMoth?: number;
}

export const OpenTimeSchema = SchemaFactory.createForClass(OpenTime);

//sort khi pre save
