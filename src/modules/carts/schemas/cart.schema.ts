import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';
import { CartItem } from './cart-item.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart extends BaseObject {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	accountID: User;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }] })
	cartItemIDs: CartItem[];

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }] })
	promotions?: Promotion[];

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ required: true, type: Number, min: 0 })
	totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
