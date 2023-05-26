import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Bill } from 'src/modules/bills/schemas/bill.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export enum SubscriptionStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Subscription extends BaseObject {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	customerID: User;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Bill' })
	billID: Bill;

	// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Package' })
	// @ApiProperty()
	// packageID: Package;

	@Prop({ required: true, type: Date })
	expires: Date;

	@Prop({ enum: Status, default: Status.ACTIVE, type: String })
	status: Status;

	@Prop({ default: false, type: Boolean })
	renew: boolean;
}

export const SubcriptionSchema = SchemaFactory.createForClass(Subscription);
