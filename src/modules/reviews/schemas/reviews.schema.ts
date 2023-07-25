import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review extends BaseObject {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	})
	accountID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
	})
	facilityID: string;

	@Prop({ required: true, min: 1, max: 5 })
	rating: number;

	@Prop({ required: true, default: '' })
	comment: string;

	@Prop({ type: [PhotoSchema], required: false, default: [] })
	photos: Photo[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// export const ReviewSchemaFactory = (
// 	photoModel: Model<PhotoDocument>,
// 	facilityModel: Model<FacilityDocument>,
// ) => {
// 	const reviewSchema = ReviewSchema;

// 	// reviewSchema.pre('findOneAndDelete', async function (next) {
// 	// 	const review = await this.model.findOne(this.getFilter());
// 	// 	console.log('review deleted >> ', review);

// 	// 	review.photos.forEach(async (el) => {
// 	// 		await photoModel.findOneAndDelete({ _id: el._id });
// 	// 	});

// 	// 	// await facilityModel.findOneAndUpdate(
// 	// 	// 	{ _id: review.facilityID },
// 	// 	// 	{ $pull: { reviews: { _id: review._id } } },
// 	// 	// );
// 	// 	return next();
// 	// });

// 	// reviewSchema.post('save', async function (doc, next) {
// 	// 	const facilityID = doc.facilityID;
// 	// 	console.log('da tao review');
// 	// 	await facilityModel.findOneAndUpdate(
// 	// 		{ _id: facilityID },
// 	// 		{
// 	// 			$push: {
// 	// 				reviews: {
// 	// 					$each: [doc],
// 	// 					$slice: -appConfig.maxElementEmbedd,
// 	// 				},
// 	// 			},
// 	// 		},
// 	// 	);
// 	// 	return next();
// 	// });

// 	return reviewSchema;
// };
