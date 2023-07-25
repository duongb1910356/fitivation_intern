import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { appConfig } from 'src/app.config';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';

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

	// @Prop({ type: Array })
	@Prop({
		type: {
			type: String,
			enum: ['Point'],
			default: 'Point',
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	})
	facilityCoordinatesLocation?: {
		type: string;
		coordinates: [number, number];
	};

	@Prop({
		type: [{ type: PhotoSchema, required: true }],
		validate: {
			validator: (photos: any[]) =>
				photos.length <= parseInt(appConfig.maxElementEmbedd),
			message: `Facility have ${appConfig.maxElementEmbedd} photo latest`,
		},
		default: [],
	})
	facilityPhotos?: Photo[];
}

export const BillItemFacilitySchema =
	SchemaFactory.createForClass(BillItemFacility);
