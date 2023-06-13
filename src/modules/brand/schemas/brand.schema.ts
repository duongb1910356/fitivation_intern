import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand extends BaseObject {
	@Prop({ type: String, required: true, unique: true })
	name: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	accountID: User;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
