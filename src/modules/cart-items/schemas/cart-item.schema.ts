import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';
import { Package } from 'src/modules/package/entities/package.entity';

export type CartItemDocument = HydratedDocument<CartItem>;

@Schema({ timestamps: true })
export class CartItem extends BaseObject {
	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Package',
	})
	packageID: Package;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Promotion',
	})
	promotionIDs?: Promotion[];

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
