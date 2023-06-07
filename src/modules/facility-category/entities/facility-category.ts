import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

@Schema()
export class FacilityCategory extends BaseObject {
	@Prop({ type: String, required: true })
	type: string;

	@Prop({ type: String, required: true })
	name: string;
}

export const FacilityCategorySchema = SchemaFactory.createForClass(FacilityCategory);
