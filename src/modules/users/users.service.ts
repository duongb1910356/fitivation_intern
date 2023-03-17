import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { SuccessResponse } from '../../shared/response/success-response';
import { Password } from '../../utils/password';
import { RegisterDto } from '../auth/dto/register-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUserDto } from './dto/get-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(filter: Partial<User>): Promise<User> {
    return this.userModel.findOne(filter);
  }

  async findAll(filter: GetUserDto): Promise<User[]> {
    const { limit, offset } = filter;
    return this.userModel.find(filter).limit(limit).skip(offset);
  }

  async createOne(input: CreateUserDto | RegisterDto): Promise<User> {
    return this.userModel.create(input);
  }

  async updateOne(input: UpdateUserDto): Promise<User> {
    const { id, password, displayName } = input;

    try {
      if (password) {
        input.password = await Password.hashPassword(password);
      }
      if (password || displayName) {
        delete input.id;
        return await this.userModel.findByIdAndUpdate(id, input, { new: true });
      }
      throw new BadRequestException('Data invalid!');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async deleteOne({ id }: any): Promise<SuccessResponse<User>> {
    try {
      if (!isValidObjectId(id)) throw new BadRequestException('ID invalid!');

      await this.userModel.findOneAndRemove({
        _id: id,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Delete success!',
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updateAvatar(userId: string, filePath: string): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(
        userId,
        {
          avatar: filePath,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
