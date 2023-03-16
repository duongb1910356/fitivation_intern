import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseObject } from 'src/shared/schemas/base-object.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Schema({ timestamps: true })
export class User extends BaseObject {
  @Prop({ minlength: 3, maxlength: 12 })
  @ApiProperty()
  displayName: string;

  @Prop({ unique: true })
  @ApiProperty()
  email: string;

  @Prop({ minlength: 6 })
  @ApiProperty()
  password: string;

  @Prop()
  @ApiProperty()
  role: UserRole;

  @Prop()
  @ApiProperty()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
