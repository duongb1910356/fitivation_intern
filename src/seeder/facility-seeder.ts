import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { facilitiesData } from './data/facility-data';

@Injectable()
export class FacilitySeeder implements Seeder {
	constructor(
		@InjectModel(Facility.name)
		private readonly facilityModel: Model<Facility>,
	) {}

	async seed(): Promise<any> {
		this.facilityModel.insertMany(facilitiesData);
	}

	async drop(): Promise<any> {
		await this.facilityModel.deleteMany({});
	}
}
