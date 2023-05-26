import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Facility, FacilitySchema } from '../../facility/schemas/facility.schema';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({timestamps: true})
export class Brand extends BaseObject {
    @Prop({type: String, required: true, unique: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true })
    accountId: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
