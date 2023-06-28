import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Photo } from 'src/modules/photo/schemas/photo.schema';

export type BillItemFacilityDocument = HydratedDocument<BillItemFacility>;

@Schema({ timestamps: true })
export class BillItemFacility {
	@Prop({ required: true, type: String })
	brandName: string;

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

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo', defautl: [] }],
		validate: {
			validator: (photos: any[]) => photos.length <= 5,
			message: 'Facility have 5 photo latest',
		},
		default: [],
	})
	facilityPhotos?: Photo[];
}

export const BillItemFacilitySchema =
	SchemaFactory.createForClass(BillItemFacility);
