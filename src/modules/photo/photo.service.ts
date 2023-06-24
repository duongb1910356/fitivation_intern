import { BadRequestException, Injectable } from '@nestjs/common';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { appConfig } from 'src/app.config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { GenFileName } from 'src/utils/gen-filename';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PhotoService {
	// @Inject('PhotoRepository')
	// private readonly photoRepository: PhotoRepository,
	constructor(
		@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
	) {}

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
		return this.photoModel.create(input);
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

	async findMany(filter: ListOptions<Photo>): Promise<ListResponse<Photo>> {
		const sortQuery = {};
		sortQuery[filter.sortField] = filter.sortOrder === 'asc' ? 1 : -1;
		const limit = filter.limit || 0;
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
	}

	async findOneByID(id: string): Promise<Photo> {
		return await this.photoModel.findById(id);
	}

	async delete(id: string): Promise<boolean> {
		if (isValidObjectId(id)) {
			await this.photoModel.findOneAndDelete({ _id: id });
		}
		return null;
	}
}
