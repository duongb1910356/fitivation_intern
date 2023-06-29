import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ShiftTime {
	@Prop({ type: String })
	startTime: string;

	@Prop({ type: String })
	endTime: string;
}

export const ShiftTimeSchema = SchemaFactory.createForClass(ShiftTime);
