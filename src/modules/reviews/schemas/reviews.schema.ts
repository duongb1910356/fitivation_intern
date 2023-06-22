import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { appConfig } from 'src/app.config';
import {
	Facility,
	FacilityDocument,
} from 'src/modules/facility/schemas/facility.schema';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review extends BaseObject {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	accountID: User;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
	})
	facilityID: Facility;

	@Prop({ required: true, min: 1, max: 5 })
	rating: number;

	@Prop({ required: true, default: '' })
	comment: string;

	@Prop({ type: [PhotoSchema], required: false, default: [] })
	photos: Photo[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewSchemaFactory = (facilityModel: Model<FacilityDocument>) => {
	const reviewSchema = ReviewSchema;

	reviewSchema.post('save', async function (doc) {
		const facilityID = doc.facilityID;
		await facilityModel.findOneAndUpdate(
			{ _id: facilityID },
			{
				$push: {
					reviews: {
						$each: [doc],
						$slice: -appConfig.maxElementEmbedd,
					},
				},
			},
		);
	});

	reviewSchema.pre('findOneAndDelete', async function (next) {
		const review = await this.model.findOne(this.getFilter());
		console.log('review deleted >> ', review);
		await facilityModel.findOneAndUpdate(
			{ _id: review.facilityID },
			{ $pull: { reviews: { _id: review._id } } },
		);
		return next();
	});

	return reviewSchema;
};
