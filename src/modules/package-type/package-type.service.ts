import {
	CountObject,
	TargetObject,
} from './../counter/entities/counter.entity';
import { CounterService } from './../counter/counter.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	PackageType,
	PackageTypeDocument,
} from './entities/package-type.entity';
import { Model } from 'mongoose';
import { CreatePackageTypeDto } from './dto/create-package-type-dto';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { UpdateOrderDto } from './dto/update-order-dto';
import { UpdatePackageTypeDto } from './dto/update-package-type-dto';

@Injectable()
export class PackageTypeService {
	constructor(
		@InjectModel(PackageType.name)
		private packageTypeModel: Model<PackageTypeDocument>,
		private readonly counterService: CounterService,
	) {}

	async findById(packageTypeID: string): Promise<PackageType> {
		const packageType = await this.packageTypeModel.findById(packageTypeID);
		if (!packageType) throw new NotFoundException('Not found Package Type');
		return packageType;
	}

	async findMany(
		filter: ListOptions<PackageType>,
	): Promise<ListResponse<PackageType>> {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;

		const packageTypes = await this.packageTypeModel
			.find(condition)
			.sort({ [sortField]: sortOrder === 'asc' ? -1 : 1 })
			.limit(limit)
			.skip(offset);

		if (packageTypes)
			return {
				items: packageTypes,
				total: packageTypes.length,
				options: filter,
			};
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
		let counter = await this.counterService.findOneByCondition(counterData);

		if (!counter) {
			counter = await this.counterService.create(counterData);
		}

		counter = await this.counterService.increase(counter._id);

		const packageTypeData = { ...data, facilityID, order: counter.count };

		return await this.packageTypeModel.create(packageTypeData);
	}

	async findManyByFacility(
		facilityID: string,
		filter: ListOptions<PackageType>,
	): Promise<ListResponse<PackageType>> {
		const { limit, offset, sortField, sortOrder, ...more } = filter;
		const condition = { ...more, facilityID };
		const projection = '_id name description price order';

		const packageTypes = await this.packageTypeModel
			.find(condition, projection)
			.sort({ [sortField]: sortOrder === 'asc' ? -1 : 1 })
			.limit(limit)
			.skip(offset);

		if (packageTypes)
			return {
				items: packageTypes,
				total: packageTypes.length,
				options: filter,
			};
	}

	async update(
		packageTypeID: string,
		data: UpdatePackageTypeDto,
	): Promise<PackageType> {
		return await this.packageTypeModel.findByIdAndUpdate(packageTypeID, data, {
			new: true,
		});
	}

	async delete(packageTypeID: string): Promise<string> {
		const packageType = await this.packageTypeModel.findById(packageTypeID);
		if (!packageType) {
			throw new NotFoundException('Package type not found');
		}
		const facilityID = packageType.facilityID.toString();
		const order = packageType.order;

		await this.packageTypeModel.findByIdAndDelete(packageTypeID);

		const counterData = {
			targetObject: TargetObject.FACILITY,
			targetID: facilityID,
			countObject: CountObject.PACKAGE_TYPE,
		};
		const counter = await this.counterService.findOneByCondition(counterData);
		await this.counterService.decrease(counter._id);

		await this.decreaseOrderAfterDeletion(facilityID, order);
		return 'Delete PackageType successfull!!!';
	}

	async decreaseOrderAfterDeletion(facilityID: string, deletedOrder: number) {
		const packageTypes = await this.packageTypeModel
			.find({ facilityID, order: { $gt: deletedOrder } })
			.exec();

		for (const packageType of packageTypes) {
			packageType.order -= 1;
			await packageType.save();
		}
	}

	async swapOrder(facilityID: string, data: UpdateOrderDto): Promise<string> {
		const [packageType1, packageType2] = await Promise.all([
			this.packageTypeModel.findOne({ facilityID, order: data.order1 }),
			this.packageTypeModel.findOne({ facilityID, order: data.order2 }),
		]);
		if (!packageType1 || !packageType2) {
			throw new NotFoundException('Package types not found');
		}

		packageType1.order = data.order2;
		packageType2.order = data.order1;
		await Promise.all([packageType1.save(), packageType2.save()]);

		return 'Swap Order successfull!!!';
	}
}
