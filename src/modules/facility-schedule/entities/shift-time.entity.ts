import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ShiftTime {
	@Prop({ type: Date })
	startTime: Date;

	@Prop({ type: Date })
	endTime: Date;
}

export const ShiftTimeSchema = SchemaFactory.createForClass(ShiftTime);
