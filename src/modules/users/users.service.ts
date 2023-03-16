import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(filter: Partial<User>): Promise<User> {
    return this.userModel.findOne(filter);
  }

  async createOne(input: CreateUserDto): Promise<User> {
    return this.userModel.create(input);
  }
}
