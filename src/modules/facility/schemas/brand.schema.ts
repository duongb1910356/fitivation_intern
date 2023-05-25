import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Facility, FacilitySchema } from './facility.schema';

export type BrandDocument = HydratedDocument<Brand>;

@Schema()
export class Brand extends BaseObject {
    @Prop({ required: true, unique: true })
    @IsNotEmpty()
    name: string;

    // //Nhật
    // @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, required: true })
    // accountId: Account;

    // @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Facility' }], required: true })
    // facilityId: Facility[];
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
