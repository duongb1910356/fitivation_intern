import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import {
	Review,
	ReviewSchema,
} from 'src/modules/reviews/schemas/reviews.schema';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';
import { appConfig } from 'src/app.config';

export enum State {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum Status {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
}

export enum ScheduleType {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}

// export interface Address {
// 	province: {
// 		name: string;
// 		code: number;
// 	};
// 	district: {
// 		name: string;
// 		code: number;
// 	};
// 	commune: {
// 		name: string;
// 		code: number;
// 	};
// }

export type FacilityDocument = HydratedDocument<Facility>;

@Schema({ timestamps: true })
export class Facility extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Brand',
		required: false,
		default: '',
	})
	brandID: string;

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FacilityCategory' }],
		required: true,
	})
	facilityCategoryID: string[];

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	ownerID: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Object, required: true })
	address: {
		street: string;
		province: string;
		provinceCode: string;
		district: string;
		districtCode: string;
		commune: string;
		communeCode: string;
	};

	@Prop({ type: String, required: false, default: '' })
	fullAddress: string;

	@Prop({ default: '' })
	summary: string;

	@Prop({ default: '' })
	description: string;

	@Prop({
		type: [Number],
		required: false,
		default: [],
	})
	coordinates: [number, number];

	@Prop({
		type: {
			type: String,
			enum: ['Point'],
			default: 'Point',
		},
		coordinates: {
			type: [Number],
			required: true,
			validate: [
				{
					validator: (value: number[]) => value.length === 2,
					message: 'Coordinates must be an array of length 2.',
				},
				{
					validator: (value: number[]) =>
						typeof value[0] === 'number' &&
						typeof value[1] === 'number' &&
						value[0] >= -180 &&
						value[0] <= 180 &&
						value[1] >= -90 &&
						value[1] <= 90,
					message: 'Invalid longitude or latitude.',
				},
			],
		},
	})
	location: {
		type: string;
		index: '2dsphere';
		coordinates: [number, number];
	};

	@Prop({ enum: State, default: State.ACTIVE })
	state: State;

	@Prop({ enum: Status, default: Status.APPROVED })
	status: Status;

	@Prop({ required: false, min: 0 })
	averageStar: number;

	@Prop({ type: String, required: true })
	phone: string;

	@Prop({
		type: [{ type: PhotoSchema, required: true }],
		validate: {
			validator: (photos: any[]) =>
				photos.length <= parseInt(appConfig.maxElementEmbedd),
			message: `Facility have ${appConfig.maxElementEmbedd} photo latest`,
		},
		default: [],
	})
	photos: Photo[];

	@Prop({
		type: [{ type: ReviewSchema, required: false }],
		validate: {
			validator: (reviews: any[]) =>
				reviews.length <= parseInt(appConfig.maxElementEmbedd),
			message: `Facility have ${appConfig.maxElementEmbedd} reviews latest`,
		},
		default: [],
	})
	reviews: Review[];

	// @Prop({ enum: ScheduleType, default: ScheduleType.WEEKLY })
	// scheduleType: ScheduleType;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FacilitySchedule',
		required: false,
	})
	schedule: string;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
FacilitySchema.index({ location: '2dsphere' });

export const FacilitySchemaFactory = () => {
	const facilitySchema = FacilitySchema;

	facilitySchema.pre('save', async function (next) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const facility = this;
		facility.fullAddress = `${facility.address.street}, ${facility.address.commune}, ${facility.address.district}, ${facility.address.province}`;
		return next();
	});

	return facilitySchema;
};
