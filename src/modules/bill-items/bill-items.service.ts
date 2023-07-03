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
import { BillsService } from '../bills/bills.service';
import { BrandService } from '../brand/brand.service';

@Injectable()
export class BillItemsService {
	constructor(
		@InjectModel(BillItem.name)
		private billItemsModel: Model<BillItemsDocument>,
		private packageService: PackageService,
		private billService: BillsService,
		private brandService: BrandService,
	) {}

	async findMany(
		query: QueryObject,
		user: TokenPayload,
	): Promise<ListResponse<Bill>> {
		const queryFeatures = new QueryAPI(this.billItemsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		if (user.role === UserRole.MEMBER) {
			queryFeatures.queryModel.find({ accountID: user.sub });
		}
		if (user.role === UserRole.FACILITY_OWNER) {
			queryFeatures.queryModel.find({ ownerID: user.sub });
		}

		const billItems = await queryFeatures.queryModel;

		return {
			total: billItems.length,
			queryOptions: queryFeatures.queryOptions,
			items: billItems,
		};
	}

	async findManyOneOwnFacility(
		query: QueryObject,
		facilityID: string,
	): Promise<ListResponse<BillItem>> {
		const queryFeatures = new QueryAPI(this.billItemsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		const billItems = await queryFeatures.queryModel.find({ facilityID });

		return {
			total: billItems.length,
			queryOptions: queryFeatures.queryOptions,
			items: billItems,
		};
	}

	async findManyOneOwnPackage(
		query: QueryObject,
		packageID: string,
	): Promise<ListResponse<BillItem>> {
		const queryFeatures = new QueryAPI(this.billItemsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		const billItems = await queryFeatures.queryModel.find({ packageID });

		return {
			total: billItems.length,
			queryOptions: queryFeatures.queryOptions,
			items: billItems,
		};
	}

	async findManyOneOwnBrand(
		query: QueryObject,
		brandID: string,
	): Promise<ListResponse<BillItem>> {
		const queryFeatures = new QueryAPI(this.billItemsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		const billItems = await queryFeatures.queryModel.find({ brandID });

		return {
			total: billItems.length,
			queryOptions: queryFeatures.queryOptions,
			items: billItems,
		};
	}

	async findOneByCondition(condition: any): Promise<BillItem> {
		const billItem = await this.billItemsModel.findOne(condition);
		if (!billItem) throw new NotFoundException('Not found bill-item');

		return billItem;
	}

	async findOneByID(billItemId: string, user: TokenPayload): Promise<BillItem> {
		const billItem = await this.billItemsModel.findById(billItemId);

		const bill = await this.billService.findOne({
			billItems: { $in: billItem },
		});

		if (
			user.role === UserRole.MEMBER &&
			user.sub.toString() !== bill.accountID.toString()
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

	async createOne(packageID: string): Promise<BillItem> {
		const packageItem = await this.packageService.findOneByID(
			packageID,
			'facilityID packageTypeID',
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
				facilityCoordinatesLocation: packageItem.facilityID.coordinates,
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
