import { Photo } from './../../photo/schemas/photo.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PhotoSchema } from 'src/modules/photo/schemas/photo.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type FacilityCategoryDocument = HydratedDocument<FacilityCategory>;

@Schema({ timestamps: true })
export class FacilityCategory extends BaseObject {
	@Prop({ type: String, required: true })
	type: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: PhotoSchema })
	photo: Photo;
}

export const FacilityCategorySchema =
	SchemaFactory.createForClass(FacilityCategory);
