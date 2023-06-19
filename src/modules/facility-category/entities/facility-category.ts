import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type FacilityCategoryDocument = HydratedDocument<FacilityCategory>;

@Schema({ timestamps: true })
export class FacilityCategory extends BaseObject {
	@Prop({ type: String, required: true })
	type: string;

	@Prop({ type: String, required: true })
	name: string;
}

export const FacilityCategorySchema =
	SchemaFactory.createForClass(FacilityCategory);
