import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export enum CategoryType {
	YOGA = 'YOGA',
	GYM = 'GYM',
	AEROPIC = 'AEROPIC',
	SPA = 'SPA',
}

@Schema()
export class Package extends BaseObject {
	@Prop({ type: String, enum: CategoryType, required: true })
	type: PackageType;

	@Prop({ type: String, required: true })
	name: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
