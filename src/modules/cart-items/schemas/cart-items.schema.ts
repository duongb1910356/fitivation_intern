import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';
import { Cart } from 'src/modules/carts/schemas/cart.schema';

export type CartItemDocument = HydratedDocument<CartItem>;

@Schema({ timestamps: true })
export class CartItem extends BaseObject {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Promotion',
	})
	@ApiProperty()
	promotionID?: Promotion;

	// @Prop({
	// 	required: true,
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'Package',
	// })
	// @ApiProperty()
	// packageID: Package;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
	@ApiProperty()
	cartID: Cart;

	@Prop({ required: true, type: Number, min: 0 })
	@ApiProperty()
	price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
