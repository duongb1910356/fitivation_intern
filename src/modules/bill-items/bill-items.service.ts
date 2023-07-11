import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillItem, BillItemsDocument } from './schemas/bill-item.schema';
import { PackageService } from '../package/package.service';
import { BillItemFacility } from './schemas/bill-item-facility.schema';
import {
	ListResponse,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import { TokenPayload } from '../auth/types/token-payload.type';
import { Bill } from '../bills/schemas/bill.schema';
import { UserRole } from '../users/schemas/user.schema';
import { BrandService } from '../brand/brand.service';

@Injectable()
export class BillItemsService {
	constructor(
		@InjectModel(BillItem.name)
		private billItemsModel: Model<BillItemsDocument>,
		private packageService: PackageService,
		private brandService: BrandService,
	) {}

	async findOneByCondition(condition: any): Promise<BillItem> {
		const billItem = await this.billItemsModel.findOne(condition);
		if (!billItem) throw new NotFoundException('Not found bill-item');

		return billItem;
	}

	async findOneByID(billItemId: string, user: TokenPayload): Promise<BillItem> {
		const billItem = await this.billItemsModel.findById(billItemId);

		if (!billItem) throw new NotFoundException('Not found bill item');

		if (
			user.role === UserRole.MEMBER &&
			user.sub.toString() !== billItem.accountID.toString()
		) {
			throw new ForbiddenException('Forbidden resource');
		}
		if (
			user.role === UserRole.FACILITY_OWNER &&
			!(await this.packageService.isOwner(billItem.packageID, user.sub))
		) {
			throw new ForbiddenException('Forbidden resource');
		}

		return billItem;
	}

	async createOne(packageID: string, userID: string): Promise<BillItem> {
		const packageItem = await this.packageService.findOneByID(
			packageID,
			'packageTypeID facilityID',
		);

		const brand = await this.brandService.findOneByID(
			packageItem.facilityID.brandID.toString(),
		);

		const totalPrice = packageItem.price;

		const billItemObj = {
			brandID: brand._id.toString(),
			facilityID: packageItem.facilityID._id.toString(),
			packageTypeID: packageItem.packageTypeID._id.toString(),
			packageID: packageID.toString(),
			ownerFacilityID: packageItem.facilityID.ownerID.toString(),
			accountID: userID,
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
				facilityCoordinatesLocation: packageItem.facilityID.location,
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
	async deleteOneByID(billItemID: string): Promise<boolean> {
		const billItem = await this.billItemsModel.findById(billItemID);

		if (!billItem) return false;

		await this.billItemsModel.deleteOne({ _id: billItemID });

		return true;
	}
}
