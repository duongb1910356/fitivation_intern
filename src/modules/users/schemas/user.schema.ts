import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from '../../../shared/schemas/base-object.schema';
import { UserAddress } from './user-address.schema';
import { Photo, PhotoSchema } from 'src/modules/photo/schemas/photo.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

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

	@Prop({
		required: true,
		unique: true,
		type: String,
		lowercase: true,
		match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
	})
	email: string;

	@Prop({ required: true, minlength: 6 })
	password: string;

	@Prop({ default: null, type: String })
	refreshToken: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 20 })
	displayName: string;

	@Prop({ type: String, minlength: 2, maxlength: 20 })
	firstName?: string;

	@Prop({ type: String, minlength: 2, maxlength: 40 })
	lastName?: string;

	@Prop({ enum: Gender, type: String })
	gender?: Gender;

	@Prop({ type: Date })
	birthDate?: Date;

	@Prop({
		type: String,
		maxlength: 10,
		minlength: 8,
		match: /^\d+$/,
	})
	tel?: string;

	@Prop({ type: UserAddress })
	address?: UserAddress;

	@Prop({ type: PhotoSchema, required: false })
	avatar?: Photo;

	@Prop({ type: Boolean })
	isMember?: boolean;

	@Prop({ default: UserStatus.ACTIVE, enum: UserStatus, type: String })
	status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
