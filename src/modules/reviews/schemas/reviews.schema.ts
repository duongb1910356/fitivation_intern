import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import {
	Photo,
	PhotoDocument,
	PhotoSchema,
} from 'src/modules/photo/schemas/photo.schema';
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

export const ReviewSchemaFactory = (photoModel: Model<PhotoDocument>) => {
	const photoSchema = ReviewSchema;

	// photoSchema.pre('findOneAndDelete', async function (next: NextFunction) {
	// 	const review = await this.model.findOne(this.getFilter());
	// 	console.log('loi o day, ', review.accountID);
	// 	await Promise.all([
	// 		photoModel
	// 			.deleteMany({
	// 				ownerID: review.accountID,
	// 			})
	// 			.exec(),
	// 	]);
	// 	console.log('loi o day 2');

	// 	return next();
	// });

	return photoSchema;
};
