import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';
import { Model } from 'mongoose';
import { PackageService } from '../package/package.service';
import { PromotionsService } from '../promotions/promotions.service';
import { PromotionMethod } from '../promotions/schemas/promotion.schema';

@Injectable()
export class CartItemsService {
	constructor(
		@InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
		private packgeService: PackageService,
		private promotionService: PromotionsService,
	) {}

	async findOneByID(cartItemID: string): Promise<CartItem> {
		const cartItem = await this.cartItemModel.findOne({ _id: cartItemID });

		if (!cartItem) throw new NotFoundException(`Not found cart-item`);

		return cartItem;
	}

	async createCartItem(packageID: string): Promise<CartItem> {
		const packageItem = await this.packgeService.findOneByID(packageID);

		const cartItem = await this.cartItemModel.create({ packageID: packageID });

		if (!cartItem) throw new BadRequestException(`Create cart-item failed`);

		cartItem.totalPrice = packageItem.price;

		await cartItem.save();

		return cartItem;
	}

	async deleteOne(cartItemID: string): Promise<boolean> {
		const cartItem = await this.cartItemModel.findById(cartItemID);

		if (!cartItem) return false;

		await this.cartItemModel.deleteOne({ _id: cartItemID });

		return true;
	}

	async updatePrice(cartItemID: string, promotionID: string): Promise<boolean> {
		const cartItem: any = await this.cartItemModel
			.findOne({ _id: cartItemID })
			.populate('packageID');

		if (promotionID) {
			const promotion = await this.promotionService.findOneByID(promotionID);

			if (promotion.method === PromotionMethod.NUMBER) {
				let finalPrice = 0;
				finalPrice = cartItem.packageID.price - promotion.value;

				cartItem.totalPrice = finalPrice;
				cartItem.promotionPrice = promotion.value;
			}

			if (promotion.method === PromotionMethod.PERCENT) {
				let finalPrice = 0;
				let promotionPrice = cartItem.packageID.price * promotion.value;

				if (promotionPrice > promotion.maxValue) {
					promotionPrice = promotion.maxValue;
				}

				finalPrice = cartItem.packageID.price - promotionPrice;

				cartItem.totalPrice = finalPrice;
				cartItem.promotionPrice = promotionPrice;
			}
			await cartItem.save();
		} else {
			cartItem.totalPrice = cartItem.packageID.price;
			await cartItem.save();
		}

		return true;
	}

	// async addPackagePromotionToCartItem(
	// 	cartItemID: string,
	// 	promotionID: string,
	// ): Promise<boolean> {
	// 	const promotion = await this.promotionService.findOneByID(promotionID);

	// 	const cartItem: any = await this.cartItemModel
	// 		.findOne({ _id: cartItemID })
	// 		.populate('packageID');

	// 	if (!cartItem) throw new NotFoundException(`Not found cart-item`);

	// 	//check package promotion belong to that package
	// 	if (cartItem.packageID._id.toString() !== promotion.targetID.toString()) {
	// 		throw new BadRequestException(
	// 			'This promotion does not belong to this package',
	// 		);
	// 	}

	// 	// check promotion type === PACKAGE
	// 	if (promotion.type !== PromotionType.PACKAGE) {
	// 		throw new BadRequestException(
	// 			'This promotion is not package promotion type',
	// 		);
	// 	}

	// 	// check date
	// 	if (new Date(promotion.endDate) <= new Date(Date.now())) {
	// 		throw new BadRequestException('This promotion was expired');
	// 	}

	// 	// check minPriceApply
	// 	if (promotion.method === PromotionMethod.NUMBER) {
	// 		if (cartItem.packageID.price < promotion.minPriceApply) {
	// 			throw new BadRequestException(
	// 				`Can't apply promotion price because package price is less than min price apply`,
	// 			);
	// 		}
	// 	}

	// 	// update price
	// 	await this.updatePrice(cartItem, promotion._id.toString());
	// 	cartItem.promotionIDs.push(promotion._id);
	// 	await cartItem.save();
	// 	return true;
	// }
}
