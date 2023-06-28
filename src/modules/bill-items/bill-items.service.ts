import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillItem, BillItemsDocument } from './schemas/bill-item.schema';
import { PackageService } from '../package/package.service';
import { FacilityService } from '../facility/facility.service';
import { PackageTypeService } from '../package-type/package-type.service';
import { BrandService } from '../brand/brand.service';
import { BillItemFacility } from './schemas/bill-item-facility.schema';
import { BillItemPackageType } from './schemas/bill-item-package-type.schema';
import { BillItemPackage } from './schemas/bill-item-package.schema';

@Injectable()
export class BillItemsService {
	constructor(
		@InjectModel(BillItem.name)
		private billItemsModel: Model<BillItemsDocument>,
		private pacakgeService: PackageService,
		private facilityService: FacilityService,
		private packageTypeService: PackageTypeService,
		private brandService: BrandService,
	) {}

	async findOneByCondition(condition: any): Promise<BillItem> {
		return await this.billItemsModel.findOne(condition);
	}

	async createOne(packageID: string): Promise<BillItem> {
		const packageItem = await this.pacakgeService.findOneByID(packageID);

		const packageType = await this.packageTypeService.findOneByID(
			packageItem.packageTypeID.toString(),
		);

		const facility = await this.facilityService.findOneByID(
			packageItem.facilityID.toString(),
		);

		// const brand = await this.brandService.findOne(
		// 	packageItem.facilityID.toString(),
		// );
		const brand = { _id: 'id', name: 'name' };

		const totalPrice = packageItem.price;

		const billItemObj = {
			brandID: brand._id,
			facilityID: facility._id,
			packageTypeID: packageType._id,
			packageID: packageID,
			facilityInfo: {
				brandName: brand.name,
				ownerFacilityName: facility.ownerID.displayName,
				facilityName: facility.name,
				facilityAddress: facility.address,
				facilityCoordinatesLocation: facility.coordinationLocation,
				facilityPhotos: facility.photos,
			} as BillItemFacility,
			packageTypeInfo: {
				name: packageType.name,
				description: packageType.description,
				price: packageType.price,
			} as BillItemPackageType,
			packageInfo: {
				type: packageItem.type,
				price: packageItem.price,
			} as BillItemPackage,
			promotions: [],
			promotionPrice: 0,
			totalPrice: totalPrice,
		};

		const billItem = await this.billItemsModel.create(billItemObj);

		if (!billItem)
			throw new InternalServerErrorException('Create Bill-item failed');

		return billItem;
	}
}
