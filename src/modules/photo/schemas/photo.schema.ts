import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { appConfig } from 'src/app.config';
import { Expose } from 'class-transformer';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class Photo extends BaseObject {
  @Prop({ type: String, required: true })
  ownerID: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: '' })
  describe: string;

  // @Expose({ name: 'imageURL' })
  // get imageURL(): string {
  //   let fileHost = appConfig.fileHost;
  //   return `${fileHost}/${this.ownerID}/${this.name}`;
  // }
  imageURL: string;
}

const PhotoSchema = SchemaFactory.createForClass(Photo);

PhotoSchema.virtual('imageURL').get(function (this: PhotoDocument) {
  let fileHost = appConfig.fileHost;
  return `${fileHost}/${this.ownerID}/${this.name}`;
});

export { PhotoSchema }
