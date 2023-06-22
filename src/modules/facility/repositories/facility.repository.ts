import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from '../../../shared/repositories/base-abstract.repository';
import { Facility, FacilityDocument } from '../schemas/facility.schema';

@Injectable()
export class FacilityRepository extends BaseRepositoryAbstract<Facility> {
	constructor(
		@InjectModel(Facility.name)
		private facilityModel: Model<FacilityDocument>,
	) {
		super(facilityModel);
	}
}
