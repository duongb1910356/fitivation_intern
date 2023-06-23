import { Injectable, NotFoundException } from '@nestjs/common';
import { Package, PackageDocument } from './entities/package.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { CreatePackageDto } from './dto/create-package-dto';
import { UpdatePackageDto } from './dto/update-package-dto';

@Injectable()
export class PackageService {
	constructor(
		@InjectModel(Package.name)
		private packageModel: Model<PackageDocument>,
	) {}

	async findOneByID(packageID: string, populate?: string): Promise<Package> {
		const packageData = await this.packageModel
			.findById(packageID)
			.populate(populate);
		if (!packageData) {
			throw new NotFoundException('Package not found');
		}
		return packageData;
	}

	async findMany(filter: ListOptions<Package>): Promise<ListResponse<Package>> {
		const { limit, offset, sortField, sortOrder, ...conditions } = filter;

		const packages = await this.packageModel
			.find(conditions)
			.sort({ [sortField]: sortOrder === 'asc' ? -1 : 1 })
			.limit(limit)
			.skip(offset);

		if (!packages.length) throw new NotFoundException('Packages not found');

		return {
			items: packages,
			total: packages.length,
			options: filter,
		};
	}

	async findManyByPackageType(
		packageTypeID: string,
		filter: ListOptions<Package>,
	): Promise<ListResponse<Package>> {
		const { limit, offset, sortField, sortOrder, ...optionals } = filter;
		const condition = { ...optionals, packageTypeID };

		const packages = await this.packageModel
			.find(condition)
			.sort({ [sortField]: sortOrder === 'asc' ? -1 : 1, price: -1 })
			.limit(limit)
			.skip(offset);

		if (!packages.length) throw new NotFoundException('Packages not found');

		return {
			items: packages,
			total: packages.length,
			options: filter,
		};
	}

	async create(
		packageTypeID: string,
		facilityID: string,
		data: CreatePackageDto,
	): Promise<Package> {
		const packaegeData = { ...data, packageTypeID, facilityID };
		console.log(packaegeData);
		return await this.packageModel.create(packaegeData);
	}

	async update(packageID: string, data: UpdatePackageDto): Promise<Package> {
		const packageData = await this.packageModel.findByIdAndUpdate(
			packageID,
			data,
			{
				new: true,
			},
		);
		if (!packageData) throw new NotFoundException('Package not found');
		return packageData;
	}

	async delete(packageID: string): Promise<string> {
		const packageData = await this.packageModel.findByIdAndDelete(packageID);

		if (!packageData) {
			throw new NotFoundException('Package not found');
		}

		return 'Delete Package successful';
	}

	async isOwner(packageID: string, uid: string): Promise<boolean> {
		const packageData = await this.findOneByID(packageID, 'facilityID');
		const owner = packageData.facilityID.ownerID.toString();
		return uid === owner;
	}
}
