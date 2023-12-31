import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { BillItem } from 'src/modules/bill-items/schemas/bill-item.schema';
import { Package } from 'src/modules/package/entities/package.entity';
import { Facility } from 'src/modules/facility/schemas/facility.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export enum SubscriptionStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Subscription extends BaseObject {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	accountID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BillItem',
	})
	billItemID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Package',
	})
	packageID: string;

	@Prop({
		required: true,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Facility',
	})
	facilityID: string | Facility;

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
