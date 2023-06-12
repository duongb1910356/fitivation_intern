import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TimeType } from 'src/modules/package/entities/package.entity';

export type BillItemPackageDocument = HydratedDocument<BillItemPackage>;

@Schema({ timestamps: true })
export class BillItemPackage {
	@Prop({ required: true, enum: TimeType })
	type: TimeType;

	@Prop({ required: true, type: Number, min: 0 })
	price: number;
}

export const BillItemPackageSchema =
	SchemaFactory.createForClass(BillItemPackage);
