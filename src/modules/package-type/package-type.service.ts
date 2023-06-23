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
import { Package } from '../package/entities/package.entity';
import { PackageService } from '../package/package.service';
import { CreatePackageDto } from '../package/dto/create-package-dto';

@Injectable()
export class PackageTypeService {
	constructor(
		@InjectModel(PackageType.name)
		private packageTypeModel: Model<PackageTypeDocument>,
		private readonly counterService: CounterService,
		private readonly packageService: PackageService,
	) {}

	async findOneByID(
		packageTypeID: string,
		populate?: string,
	): Promise<PackageType> {
		const packageType = await this.packageTypeModel
			.findById(packageTypeID)
			.populate(populate);
		if (!packageType) {
			throw new NotFoundException('Not found Package Type');
		}
		return packageType;
	}

	async findMany(
		filter: ListOptions<PackageType>,
	): Promise<ListResponse<PackageType>> {
		const { limit, offset, sortField, sortOrder, search, ...optionals } =
			filter;

		let conditions: object;
		console.log(search);
		if (search) {
			conditions = {
				$or: [
					{ name: { $regex: search } },
					{ description: { $regex: search } },
				],
				optionals,
			};
		} else {
			conditions = { optionals };
		}

		const packageTypes = await this.packageTypeModel
			.find(conditions)
			.sort({ [sortField]: sortOrder === 'asc' ? -1 : 1 })
			.limit(limit)
			.skip(offset);

		if (!packageTypes.length)
			throw new NotFoundException('PackageTypes not found');

		return {
			items: packageTypes,
			total: packageTypes.length,
			options: filter,
		};
	}

	async findManyByFacility(
		facilityID: string,
		filter: ListOptions<PackageType>,
	): Promise<ListResponse<PackageType>> {
		const { limit, offset, ...optionals } = filter;
		const condition = { ...optionals, facilityID };
		const projection = '_id name description price order';

		const packageTypes = await this.packageTypeModel
			.find(condition, projection)
			.sort({ order: 1 })
			.limit(limit)
			.skip(offset);

		if (!packageTypes.length)
			throw new NotFoundException('PackageTypes not found');

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

	async update(
		packageTypeID: string,
		data: UpdatePackageTypeDto,
	): Promise<PackageType> {
		const packageTypeData = await this.packageTypeModel.findByIdAndUpdate(
			packageTypeID,
			data,
			{
				new: true,
			},
		);
		if (!packageTypeData) throw new NotFoundException('PackageType not found');
		return packageTypeData;
	}

	async delete(packageTypeID: string): Promise<string> {
		const packageType = await this.packageTypeModel.findByIdAndDelete(
			packageTypeID,
		);
		if (!packageType) {
			throw new NotFoundException('PackageType not found');
		}

		await this.decreaseAfterDeletion(
			packageType.facilityID.toString(),
			packageType.order,
		);

		return 'Delete PackageType successfull!!!';
	}

	private async decreaseAfterDeletion(
		facilityID: string,
		deletedOrder: number,
	) {
		//decrease Counter by one
		const counterData = {
			targetObject: TargetObject.FACILITY,
			targetID: facilityID,
			countObject: CountObject.PACKAGE_TYPE,
		};
		const counter = await this.counterService.findOneByCondition(counterData);
		await this.counterService.decrease(counter._id);

		//decrease order in packageType after packageType deleted
		const packageTypes = await this.packageTypeModel.find({
			facilityID,
			order: { $gt: deletedOrder },
		});

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

		return 'Swap Order successful';
	}

	//For Package
	async getAllPackages(packageTypeID: string, filter: ListOptions<Package>) {
		return await this.packageService.findManyByPackageType(
			packageTypeID,
			filter,
		);
	}

	async createPackage(packageTypeID: string, data: CreatePackageDto) {
		const facilityID = (
			await this.findOneByID(packageTypeID)
		).facilityID.toString();
		console.log(facilityID);
		return await this.packageService.create(packageTypeID, facilityID, data);
	}
}
