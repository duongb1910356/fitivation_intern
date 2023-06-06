import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Facility } from 'src/modules/facility/schemas/facility.schema';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({ timestamps: true })
export class Photo extends BaseObject {
  @Prop({ type: String, required: true })
  bucketID: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: '' })
  describe: string;

  get linkURL(): string {
    return `http://localhost:8080/${this.bucketID}/${this.name}`;
  }
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
