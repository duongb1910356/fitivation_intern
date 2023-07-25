import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BillItemPackageTypeDocument = HydratedDocument<BillItemPackageType>;

@Schema({ timestamps: true })
export class BillItemPackageType {
	@Prop({ required: true, type: String })
	name: string;

	@Prop({ required: true, type: String })
	description: string;

	@Prop({ required: true, type: Number, min: 0 })
	price: number;
}

export const BillItemPackageTypeSchema =
	SchemaFactory.createForClass(BillItemPackageType);
