import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { appConfig } from 'src/app.config';
import { existsSync, unlinkSync } from 'fs';

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

	imageURL: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);

export const PhotoSchemaFactory = () => {
	const photoSchema = PhotoSchema;

	photoSchema.post('findOneAndDelete', async function (doc, next) {
		console.log('hook findOneAndDelete photo');
		const imagePath = `${appConfig.fileRoot}/${doc?.ownerID}/${doc?.name}`;
		if (existsSync(imagePath)) {
			unlinkSync(imagePath);
		} else {
			console.log('imagePath not exist');
		}
		return next();
	});

	photoSchema.virtual('imageURL').get(function () {
		const fileHost = appConfig.fileHost;
		return `${fileHost}/${this.ownerID}/${this.name}`;
	});

	return photoSchema;
};

// PhotoSchema.virtual('imageURL').get(function () {
// 	const fileHost = appConfig.fileHost;
// 	return `${fileHost}/${this.ownerID}/${this.name}`;
// });
