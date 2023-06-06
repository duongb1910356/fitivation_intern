import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Province } from './province.schema';

@Schema({timestamps: true})
export class District extends BaseObject {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true })
  province: Province;
}

export const DistrictSchema = SchemaFactory.createForClass(District);