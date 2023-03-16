import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  displayName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ minlength: 6 })
  password: string;

  @Prop()
  role: UserRole;

  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
