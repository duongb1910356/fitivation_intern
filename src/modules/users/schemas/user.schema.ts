import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
	@ApiProperty()
	role: UserRole;

	@Prop({
		required: true,
		unique: true,
		type: String,
		minlength: 2,
		maxlength: 40,
	})
	@ApiProperty()
	username: string;

	@Prop({ required: true, unique: true, type: String })
	@ApiProperty()
	email: string;

	@Prop({ required: true, minlength: 6 })
	@ApiHideProperty()
	password: string;

	@Prop({ required: true, minlength: 2, maxlength: 12 })
	@ApiProperty({ type: String })
	displayName: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 20 })
	@ApiProperty()
	firstName: string;

	@Prop({ required: true, type: String, minlength: 2, maxlength: 40 })
	@ApiProperty()
	lastName: string;

	@Prop({ required: true, enum: Gender, type: String })
	@ApiProperty()
	gender: Gender;

	@Prop({ required: true, type: Date })
	@ApiProperty()
	birthDate: Date;

	@Prop({ required: true, type: String, maxlength: 10, minlength: 8 })
	@ApiProperty()
	tell: string;

	@Prop({
		default: [],
		type: {
			province: { type: String },
			district: { type: String },
			commune: { type: String },
		},
	})
	@ApiProperty()
	address: {
		province: string;
		district: string;
		commune: number;
	};

	@Prop({ default: '', type: String })
	@ApiProperty()
	avatar?: string;

	@Prop({ type: Boolean })
	@ApiProperty()
	isMember?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
