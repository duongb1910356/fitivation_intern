import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BillItem, BillItemsDocument } from './schemas/bill-item.schema';
import { PackageService } from '../package/package.service';
import { BillItemFacility } from './schemas/bill-item-facility.schema';
import { TokenPayload } from '../auth/types/token-payload.type';
import { UserRole } from '../users/schemas/user.schema';
import { BrandService } from '../brand/brand.service';
import {
	ListResponseV2,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';

@Injectable()
export class BillItemsService {
	constructor(
		@InjectModel(BillItem.name)
		private billItemsModel: Model<BillItemsDocument>,
		private packageService: PackageService,
		private brandService: BrandService,
	) {}

	async getQuantityCustomerOfOwnFacilities(userID: string): Promise<object> {
		const stats = await this.billItemsModel.aggregate([
			{
				$match: {
					ownerFacilityID: new mongoose.Types.ObjectId(userID),
				},
			},
			{
				$group: {
					_id: '$accountID',
				},
			},
		]);

		return { numberCustomers: stats.length };
	}

	async getQuantityBillItemOwnFacilitiesStats(userID: string): Promise<object> {
		const numberbillItems = await this.billItemsModel
			.find({
				ownerFacilityID: userID,
			})
			.count();

		return { numberbillItems };
	}

	async getYearlyBillItemOwnFacilitiesStats(
		userID: string,
	): Promise<Array<object>> {
		const stats = await this.billItemsModel.aggregate([
			{
				$match: {
					ownerFacilityID: new mongoose.Types.ObjectId(userID),
				},
			},
			{
				$group: {
					_id: { $year: '$createdAt' },
					numberBillItems: { $sum: 1 },
					totalPrice: { $sum: '$totalPrice' },
					avgTotalPrice: { $avg: '$totalPrice' },
					minPrice: { $min: '$totalPrice' },
					maxPrice: { $max: '$totalPrice' },
				},
			},
			{
				$addFields: { year: '$_id' },
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: { year: -1 },
			},
		]);

		return stats;
	}

	async getMonthlyBillItemOwnFacilitiesStats(
		year: number,
		userID: string,
	): Promise<Array<object>> {
		const stats = await this.billItemsModel.aggregate([
			{
				$match: {
					$and: [
						{
							createdAt: {
								$gte: new Date(`${year}-01-01T00:00:00.000Z`),
								$lte: new Date(`${year}-12-31T00:00:00.000Z`),
							},
						},
						{
							ownerFacilityID: new mongoose.Types.ObjectId(userID),
						},
					],
				},
			},
			{
				$group: {
					_id: { $month: '$createdAt' },
					numberBillItems: { $sum: 1 },
					totalPrice: { $sum: '$totalPrice' },
					avgTotalPrice: { $avg: '$totalPrice' },
					minPrice: { $min: '$totalPrice' },
					maxPrice: { $max: '$totalPrice' },
				},
			},
			{
				$addFields: { month: '$_id' },
			},
			{
				$project: {
					_id: 0,
				},
			},
			{
				$sort: { month: -1 },
			},
		]);

		return stats;
	}

	async findManyBillItemOfOwnFacility(
		query: QueryObject,
		userID: string,
		facilityID: string,
	): Promise<ListResponseV2<BillItem>> {
		const queryFeatures = new QueryAPI(this.billItemsModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		queryFeatures.queryModel.find({
			ownerFacilityID: userID,
			facilityID,
		});

		const billItems = await queryFeatures.queryModel;

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
