import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Facility } from 'src/modules/facility/schemas/facility.schema';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({timestamps: true})
export class Photo extends BaseObject {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true })
  facilityID: Facility;

  @Prop({type: String, required: true })
  linkURL: string;

  @Prop({default: ''})
  describe: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);