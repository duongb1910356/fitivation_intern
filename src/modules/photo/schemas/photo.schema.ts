import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { appConfig } from 'src/app.config';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({ timestamps: true })
export class Photo extends BaseObject {
  @Prop({ type: String, required: true })
  ownerID: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: '' })
  describe: string;

  get imageURL(): string {
    let fileHost = appConfig.fileHost;
    return `${fileHost}/${this.ownerID}/${this.name}`;
  }
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
