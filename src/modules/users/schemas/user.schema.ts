import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
	ADMIN = 'ADMIN',
	MEMBER = 'MEMBER',
	FACILITY_OWNER = 'FACILITY_OWNER',
}

export enum Gender {
	FEMALE = 'FEMALE',
	MALE = 'MALE',
	OTHER = 'OTHER',
}

@Schema({ timestamps: true })
export class User extends BaseObject {
	@Prop({ default: UserRole.MEMBER, type: String })
	role: UserRole;

	@Prop({
		required: true,
		unique: true,
		type: String,
		minlength: 2,
		maxlength: 40,
	})
	username: string;

	@Prop({ required: true, unique: true, type: String })
	email: string;

	@Prop({ required: true, minlength: 6 })
	password: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 12 })
	displayName: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 20 })
	firstName: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	lastName: string;

	@Prop({ required: true, enum: Gender, type: String })
	gender: Gender;

	@Prop({ required: true, type: Date })
	birthDate: Date;

	@Prop({ required: true, type: String, maxlength: 10, minlength: 8 })
	tell: string;

	@Prop({
		default: [],
		type: {
			province: { type: String },
			district: { type: String },
			commune: { type: String },
		},
	})
	address: {
		province: string;
		district: string;
		commune: number;
	};

	@Prop({ default: '', type: String })
	avatar?: string;

	@Prop({ type: Boolean })
	isMember?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
