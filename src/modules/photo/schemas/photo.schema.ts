import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { appConfig } from 'src/app.config';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
})
export class Photo extends BaseObject {
	@Prop({ type: String, required: true })
	ownerID: string;

	@Prop({ type: String, required: true })
	name: string;

	// @Prop({ type: String, required: false, default: '' })
	// describe: string;

	// @Expose({ name: 'imageURL' })
	// get imageURL(): string {
	//   let fileHost = appConfig.fileHost;
	//   return `${fileHost}/${this.ownerID}/${this.name}`;
	// }
	imageURL: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);

export const PhotoSchemaFactory = () => {
	const photoSchema = PhotoSchema;

	photoSchema.virtual('imageURL').get(function (this: PhotoDocument) {
		const fileHost = appConfig.fileHost;
		return `${fileHost}/${this.ownerID}/${this.name}`;
	});

	return photoSchema;
};

// PhotoSchema.virtual('imageURL').get(function (this: PhotoDocument) {
// 	const fileHost = appConfig.fileHost;
// 	return `${fileHost}/${this.ownerID}/${this.name}`;
// });

// export { PhotoSchema };
