import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BillItemFacilityDocument = HydratedDocument<BillItemFacility>;

@Schema({ timestamps: true })
export class BillItemFacility {
	@Prop({ required: true, type: String })
	brandName: string;

	@Prop({ required: true, type: String })
	ownerFacilityName: string;

	@Prop({ required: true, type: String })
	facilityName: string;

	@Prop({ required: true, type: Object })
	facilityAddress: {
		street: string;
		province: string;
		provinceCode: string;
		district: string;
		districtCode: string;
		commune: string;
		communeCode: string;
	};

	@Prop({ type: Array })
	facilityCoordinatesLocation?: [number, number];

	@Prop({ type: String })
	facilityPhoto?: string;
}

export const BillItemFacilitySchema =
	SchemaFactory.createForClass(BillItemFacility);
