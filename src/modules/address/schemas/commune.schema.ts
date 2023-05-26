import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { District } from './district.schema';

@Schema({timestamps: true})
export class Commune extends Document {
  @Prop({type: String, required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true })
  district: District;
}

export const CommuneSchema = SchemaFactory.createForClass(Commune);