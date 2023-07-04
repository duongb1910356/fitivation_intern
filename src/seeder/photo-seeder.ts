import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Photo } from 'src/modules/photo/schemas/photo.schema';
import { photoData } from './data/photo-data';
@Injectable()
export class PhotoSeeder implements Seeder {
	constructor(
		@InjectModel(Photo.name)
		private readonly photoModel: Model<Photo>,
	) {}

	async seed(): Promise<any> {
		await this.photoModel.insertMany(photoData);
	}

	async drop(): Promise<any> {
		await this.photoModel.deleteMany({});
	}
}
