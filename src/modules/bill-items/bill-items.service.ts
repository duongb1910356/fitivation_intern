import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillItem, BillItemsDocument } from './schemas/bill-item.schema';
import { PackageService } from '../package/package.service';
import { UsersService } from '../users/users.service';
import { BillItemFacility } from './schemas/bill-item-facility.schema';

@Injectable()
export class BillItemsService {
	constructor(
		@InjectModel(BillItem.name)
		private billItemsModel: Model<BillItemsDocument>,
		private packageService: PackageService,
	) {}

	async findOneByCondition(condition: any): Promise<BillItem> {
		return await this.billItemsModel.findOne(condition);
	}

	async createOne(packageID: string): Promise<BillItem> {
		const packageItem = await this.packageService.findOneByID(
			packageID,
			'facilityID packageTypeID',
		);

		// const brand = await this.brandService.findOne(
		// 	packageItem.facilityID.toString(),
		// );
		const brand = { _id: '64944c7c2d7cf0ec0dbb4052', name: 'name' };

		const totalPrice = packageItem.price;

		const billItemObj = {
			brandID: brand._id.toString(),
			facilityID: packageItem.facilityID._id.toString(),
			packageTypeID: packageItem.packageTypeID._id.toString(),
			packageID: packageID.toString(),
			facilityInfo: {
				brandName: brand.name,
				facilityName: packageItem.facilityID.name,
				facilityAddress: {
					street: packageItem.facilityID.address.street,
					province: packageItem.facilityID.address.province,
					provinceCode: packageItem.facilityID.address.provinceCode,
					district: packageItem.facilityID.address.district,
					districtCode: packageItem.facilityID.address.districtCode,
					commune: packageItem.facilityID.address.commune,
					communeCode: packageItem.facilityID.address.communeCode,
				},
				facilityCoordinatesLocation:
					packageItem.facilityID.coordinationLocation,
				facilityPhotos: packageItem.facilityID.photos,
			} as BillItemFacility,
			packageTypeInfo: {
				name: packageItem.packageTypeID.name,
				description: packageItem.packageTypeID.description,
				price: packageItem.packageTypeID.price,
			},
			packageInfo: {
				type: packageItem.type,
				price: packageItem.price,
			},
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
