import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { appConfig } from 'src/app.config';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { GenFileName } from 'src/shared/utils/gen-filename';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PhotoService {
	// @Inject('PhotoRepository')
	// private readonly photoRepository: PhotoRepository,
	constructor(
		@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
	) {}

	async uploadOneFile(ownerID: any, file: Express.Multer.File): Promise<Photo> {
		if (isValidObjectId(ownerID) && file) {
			const dir = `${appConfig.fileRoot}/${ownerID}`;
			if (!existsSync(dir)) {
				mkdirSync(dir, { recursive: true });
			}
			const fileName = GenFileName.gen(file.mimetype);
			try {
				writeFileSync(`${dir}/${fileName}`, file.buffer);
				const input: CreatePhotoDto = {
					ownerID: ownerID,
					name: fileName,
				};
				return this.photoModel.create(input);
			} catch (error) {
				throw new BadRequestException('Upload photo failed');
			}
		}
		return null;
	}

	async uploadManyFile(
		files: { images?: Express.Multer.File[] },
		ownerID: any,
	): Promise<ListResponse<Photo>> {
		let data: Photo[] = [];
		if (isValidObjectId(ownerID) && files && files.images) {
			const uploadPromises: Promise<Photo>[] = [];
			try {
				for (const img of files.images) {
					const uploadPromise = this.uploadOneFile(ownerID, img);
					uploadPromises.push(uploadPromise);
				}
				data = await Promise.all(uploadPromises);
			} catch (error) {
				throw new BadRequestException('Upload photo failed');
			}
		}
		return {
			items: data,
			total: data.length,
			options: {},
		};
	}

	async findMany(filter: ListOptions<Photo>): Promise<ListResponse<Photo>> {
		try {
			const sortQuery = {};
			if (filter.sortField) {
				sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
			}
			const limit = filter.limit || 10;
			const offset = filter.offset || 0;
			const result = await this.photoModel
				.find(filter)
				.sort(sortQuery)
				.skip(offset)
				.limit(limit);
			return {
				items: result,
				total: result?.length,
				options: filter,
			};
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving photos',
			);
		}
	}

	async findOneByID(id: string): Promise<Photo> {
		return await this.photoModel.findById(id);
	}

	async delete(id: string): Promise<Photo> {
		const photo = await this.photoModel.findOneAndDelete({ _id: id });
		return photo;
	}
}
