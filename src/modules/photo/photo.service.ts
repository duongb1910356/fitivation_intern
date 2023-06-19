import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Photo } from './schemas/photo.schema';
import { BaseServiceAbstract } from 'src/shared/services/base-abstract.service';
import { PhotoRepository } from './repositories/photo.repository';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { appConfig } from 'src/app.config';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { GenFileName } from 'src/utils/gen-filename';
import { ListResponse } from 'src/shared/response/common-response';

@Injectable()
export class PhotoService extends BaseServiceAbstract<Photo> {
	constructor(
		// @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
		@Inject('PhotoRepository')
		private readonly photoRepository: PhotoRepository,
	) {
		super(photoRepository);
	}

	async uploadOneFile(
		photoDto: CreatePhotoDto,
		file: Express.Multer.File,
	): Promise<Photo> {
		const dir = `${appConfig.fileRoot}/${photoDto.ownerID}`;
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}
		const fileName = GenFileName.gen(file.mimetype);
		writeFileSync(`${dir}/${fileName}`, file.buffer);
		const input: CreatePhotoDto = {
			ownerID: photoDto.ownerID,
			name: fileName,
		};
		return this.photoRepository.create(input);
	}

	async uploadManyFile(
		files: { images?: Express.Multer.File[] },
		photoDto: CreatePhotoDto,
	): Promise<ListResponse<Photo>> {
		try {
			const uploadPromises: Promise<Photo>[] = [];

			for (const avatarFile of files.images) {
				const uploadPromise = this.uploadOneFile(photoDto, avatarFile);
				uploadPromises.push(uploadPromise);
			}
			const data = await Promise.all(uploadPromises);

			return {
				items: data,
				total: data.length,
				options: {},
			};
		} catch (error) {
			throw new BadRequestException('Uploading failed');
		}
	}

	async delete(id: string): Promise<boolean> {
		const deletedPhoto = await this.photoRepository.findByID(id);
		const imagePath = `${appConfig.fileRoot}/${deletedPhoto.ownerID}/${deletedPhoto.name}`;
		unlinkSync(imagePath);
		return super.delete(id);
	}

	// uploadOneFile(
	// 	file: Express.Multer.File,
	// 	photoDto: CreatePhotoDto,
	// ): Promise<Photo> {
	// 	try {
	// 		const dir = `${appConfig.fileRoot}/${photoDto.ownerID}`;
	// 		if (!existsSync(dir)) {
	// 			mkdirSync(dir, { recursive: true });
	// 		}
	// 		const fileName = GenFileName.gen(file.mimetype);
	// 		writeFileSync(`${dir}/${fileName}`, file.buffer);
	// 		const input: CreatePhotoDto = {
	// 			ownerID: photoDto.ownerID,
	// 			name: fileName,
	// 		};
	// 		return this.photoModel.create(input);
	// 	} catch (error) {
	// 		console.log('Error uploadOneFile >> ', error);
	// 		throw new BadRequestException('Uploading failed');
	// 	}
	// }

	// async findOne(filter: Partial<Photo>): Promise<Photo> {
	// 	return await this.photoModel.findOne(filter);
	// }

	// async findMany(filter: ListOptions<Photo>): Promise<ListResponse<Photo>> {
	// 	try {
	// 		const { limit, offset } = filter;
	// 		const photos = await this.photoModel
	// 			.find(filter)
	// 			.skip(offset)
	// 			.limit(limit);
	// 		return {
	// 			items: photos,
	// 			total: photos.length,
	// 			options: filter,
	// 		};
	// 	} catch (error) {
	// 		throw new BadRequestException(error);
	// 	}
	// }

	// async delete(id: string): Promise<SuccessResponse<Photo>> {
	// 	try {
	// 		const deletedPhoto = await this.photoModel.findByIdAndDelete(id);
	// 		if (!deletedPhoto) {
	// 			throw new NotFoundException('Photo not found!');
	// 		}
	// 		const imagePath = `${appConfig.fileRoot}/${deletedPhoto.ownerID}/${deletedPhoto.name}`;
	// 		unlinkSync(imagePath);
	// 		return null;
	// 	} catch (err) {
	// 		throw new BadRequestException(err);
	// 	}
	// }
}
