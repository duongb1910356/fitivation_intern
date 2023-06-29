import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Package, PackageDocument } from './entities/package.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { CreatePackageDto } from './dto/create-package-dto';
import { UpdatePackageDto } from './dto/update-package-dto';
import { CreatePromotionDto } from '../promotions/dto/create-promotion-dto';
import {
	Promotion,
	PromotionType,
} from '../promotions/schemas/promotion.schema';
import { UpdatePromotionDto } from '../promotions/dto/update-promotion-dto';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class PackageService {
	constructor(
		@InjectModel(Package.name)
		private packageModel: Model<PackageDocument>,
		private promotionService: PromotionsService,
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

	//PROMOTION
	async createPromotion(
		packageID: string,
		body: CreatePromotionDto,
	): Promise<Promotion> {
		const data = { targetID: packageID, type: PromotionType.PACKAGE, ...body };
		return await this.promotionService.create(data);
	}

	async findManyPromotion(packageID: string): Promise<ListResponse<Promotion>> {
		return await this.promotionService.findMany({ targetID: packageID });
	}

	async updatePromotion(
		promotionID: string,
		body: UpdatePromotionDto,
		req: any,
	) {
		const promotion = await this.promotionService.findOneByID(promotionID);
		const isOwner = await this.isOwner(promotion.targetID, req.user.sub);
		if (!isOwner) {
			throw new ForbiddenException(
				'You do not have permission to access this document',
			);
		}
		return await this.promotionService.update(promotionID, body);
	}

	async deletePromotion(promotionID: string, req: any) {
		const promotion = await this.promotionService.findOneByID(promotionID);
		const isOwner = await this.isOwner(promotion.targetID, req.user.sub);
		if (!isOwner) {
			throw new ForbiddenException(
				'You do not have permission to access this document',
			);
		}
		return await this.promotionService.delete(promotionID);
	}
}
