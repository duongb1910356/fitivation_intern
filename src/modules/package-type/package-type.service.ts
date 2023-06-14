import {
	CountObject,
	TargetObject,
} from './../counter/entities/counter.entity';
import { CounterService } from './../counter/counter.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	PackageType,
	PackageTypeDocument,
} from './entities/package-type.entity';
import { Model } from 'mongoose';
import { CreatePackageTypeDto } from './dto/create-package-type-dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';

@Injectable()
export class PackageTypeService {
	constructor(
		@InjectModel(PackageType.name)
		private packageTypeModel: Model<PackageTypeDocument>,
		private readonly counterService: CounterService,
	) {}

	async findOne(filter: Partial<PackageType>): Promise<PackageType> {
		return this.packageTypeModel.findOne(filter);
	}

	async create(
		facilityID: string,
		data: CreatePackageTypeDto,
	): Promise<PackageType> {
		const counterData = {
			targetObject: TargetObject.FACILITY,
			targetID: facilityID,
			countObject: CountObject.PACKAGE_TYPE,
		};
		let counter = await this.counterService.findOne(counterData);

		if (!counter) {
			counter = await this.counterService.create(counterData);
		}

		counter = await this.counterService.increase(counter._id, counter.count);

		const packageTypeData = { ...data, facilityID, order: counter.count };
		return this.packageTypeModel.create(packageTypeData);
	}

	async findMany(
		facilityID: string,
		filter: ListOptions<PackageType>,
	): Promise<ListResponse<PackageType>> {
		const condition = { ...filter, facilityID };
		console.log(filter, condition);
		const projection = '_id name description price order';

		const [count, packageTypes] = await Promise.all([
			this.packageTypeModel.count(condition),
			this.packageTypeModel
				.find(condition, projection)
				.sort({ order: 1 })
				.exec(),
		]);
		const data: ListResponse<PackageType> = {
			items: packageTypes,
			total: count,
			options: filter,
		};
		console.log(data);
		return data;
	}
}
