import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { appConfig } from 'src/app.config';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { Model } from 'mongoose';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { SuccessResponse } from 'src/shared/response/success-response';
import { GenFileName } from 'src/shared/utils/gen-filename';

@Injectable()
export class PhotoService {
	constructor(
		@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
	) {}

	uploadFile(
		file: Express.Multer.File,
		photoDto: CreatePhotoDto,
	): Promise<Photo> {
		try {
			const dir = `${appConfig.fileRoot}/${photoDto.ownerID}`;
			if (!existsSync(dir)) {
				mkdirSync(dir, { recursive: true });
			}
			const fileName = GenFileName.gen(file.mimetype);
			writeFileSync(`${dir}/${fileName}`, file.buffer);
			const input: CreatePhotoDto = {
				ownerID: photoDto.ownerID,
				name: fileName,
				describe: photoDto.describe,
			};
			return this.photoModel.create(input);
		} catch (error) {
			throw new Error('Uploading failed');
		}
	}

	async findOne(filter: Partial<Photo>): Promise<Photo> {
		return await this.photoModel.findOne(filter);
	}

	async deleteOne(id: string): Promise<SuccessResponse<Photo>> {
		try {
			const deletedPhoto = await this.photoModel.findByIdAndDelete(id);
			if (!deletedPhoto) {
				throw new NotFoundException('Photo not found!');
			}
			const imagePath = `${appConfig.fileRoot}/${deletedPhoto.ownerID}/${deletedPhoto.name}`;
			unlinkSync(imagePath);
			return null;
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
