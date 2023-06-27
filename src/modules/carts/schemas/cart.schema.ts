import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart extends BaseObject {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	accountID: string;

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
		default: [],
	})
	cartItemIDs?: string[];

	@Prop({
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }],
		default: [],
	})
	promotionIDs?: string[];

	@Prop({ default: 0, type: Number, min: 0 })
	promotionPrice: number;

	@Prop({ default: 0, type: Number, min: 0 })
	totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
