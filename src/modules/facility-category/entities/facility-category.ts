import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export enum CategoryType {
	YOGA = 'YOGA',
	GYM = 'GYM',
	AEROPIC = 'AEROPIC',
	SPA = 'SPA',
}

@Schema()
export class FacilityCategory extends BaseObject {
	@Prop({ type: String, enum: CategoryType, required: true })
	type: CategoryType;

	@Prop({ type: String, required: true })
	name: string;
}

export const PackageSchema = SchemaFactory.createForClass(FacilityCategory);
