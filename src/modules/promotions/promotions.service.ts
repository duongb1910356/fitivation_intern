import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	Promotion,
	PromotionDocument,
	PromotionStatus,
	PromotionType,
} from './schemas/promotion.schema';
import { Model } from 'mongoose';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { CreatePromotionDto } from './dto/create-promotion-dto';
import { UpdatePromotionDto } from './dto/update-promotion-dto';

export type ConditionPromotion = {
	_id?: string;
	targetID?: string;
	type?: PromotionType;
	startDate?: Date;
	endDate?: Date;
	status?: PromotionStatus;
};

@Injectable()
export class PromotionsService {
	constructor(
		@InjectModel(Promotion.name)
		private promotionModel: Model<PromotionDocument>,
	) {}

	async findOneByID(promotionID: string): Promise<Promotion> {
		const promotion = await this.promotionModel.findById(promotionID);
		if (!promotion) throw new NotFoundException('Promotion not found');
		return promotion;
	}

	async findMany(
		condition: ConditionPromotion = {},
		options: ListOptions<Promotion> = {},
	): Promise<ListResponse<Promotion>> {
		const sortQuery = {};
		sortQuery[options.sortField] = options.sortOrder === 'asc' ? 1 : -1;
		const limit = options.limit || 0;
		const offset = options.offset || 0;

		const promotions = await this.promotionModel
			.find(condition)
			.sort(sortQuery)
			.limit(limit)
			.skip(offset);

		if (!promotions.length) throw new NotFoundException('Promotions not found');

		return {
			items: promotions,
			total: promotions.length,
			options: options,
		};
	}

	async create(data: CreatePromotionDto): Promise<Promotion> {
		return await this.promotionModel.create(data);
	}

	async update(
		promotionID: string,
		data: UpdatePromotionDto,
	): Promise<Promotion> {
		const promotion = await this.promotionModel.findByIdAndUpdate(
			promotionID,
			data,
			{
				new: true,
			},
		);
		if (!promotion) throw new NotFoundException('Promotion not found');
		return promotion;
	}

	async delete(promotionID: string): Promise<string> {
		const promotion = await this.promotionModel.findByIdAndDelete(promotionID);

		if (!promotion) {
			throw new NotFoundException('Promotion not found');
		}

		return 'Delete Promotion successful';
	}
}
