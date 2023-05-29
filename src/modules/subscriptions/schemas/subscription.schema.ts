import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BillItem } from 'src/modules/bills/schemas/bill-item.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export enum SubscriptionStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Subscription extends BaseObject {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	accountID: User;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BillItem',
	})
	billItemID: BillItem;

	// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Package' })
	// @ApiProperty()
	// packageID: Package;

	@Prop({ required: true, type: Date })
	expires: Date;

	@Prop({
		enum: SubscriptionStatus,
		default: SubscriptionStatus.ACTIVE,
		type: String,
	})
	status: SubscriptionStatus;

	@Prop({ default: false, type: Boolean })
	renew: boolean;
}

export const SubcriptionSchema = SchemaFactory.createForClass(Subscription);
