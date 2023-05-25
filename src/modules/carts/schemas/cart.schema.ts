import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Promotion } from 'src/modules/promotions/schemas/promotion.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart extends BaseObject {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	@ApiProperty()
	accountID: User;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }] })
	@ApiProperty()
	promotions?: Promotion[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
