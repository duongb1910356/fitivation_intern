import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../../shared/repositories/base-abstract.repository';
import { Photo, PhotoDocument } from '../schemas/photo.schema';

@Injectable()
export class PhotoRepository extends BaseRepositoryAbstract<Photo> {
	constructor(
		@InjectModel(Photo.name)
		private photoModel: Model<PhotoDocument>,
	) {
		super(photoModel);
	}
}
