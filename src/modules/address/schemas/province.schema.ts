import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema({timestamps: true})
export class Province extends BaseObject {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);