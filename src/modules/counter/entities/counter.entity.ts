import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export enum TargetObject {
	FACILITY = 'FACILITY',
}
export enum CountObject {
	PACKAGE_TYPE = 'PACKAGE_TYPE',
}

export type CounterDocument = HydratedDocument<Counter>;

@Schema({ timestamps: true })
export class Counter extends BaseObject {
	@Prop({ type: String, enum: TargetObject, required: true })
	targetObject: TargetObject;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	})
	targetID: string;

	@Prop({ type: String, enum: CountObject, required: true })
	countObject: CountObject;

	@Prop({ type: Number, default: 0 })
	count: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
