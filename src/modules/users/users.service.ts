import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { DefaultListDto } from '../../shared/dto/default-list-dto';
import { ESortOrder } from '../../shared/enum/sort.enum';
import { SuccessResponse } from '../../shared/response/success-response';
import { Password } from '../../utils/password';
import { RegisterDto } from '../auth/dto/register-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UserDocument } from './schemas/user.schema';
import { ListOptions } from 'src/shared/response/common-response';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findOne(filter: Partial<User>): Promise<User> {
		return this.userModel.findOne(filter);
	}

	async findAll(
		filter: ListOptions<User>,
	): Promise<SuccessResponse<User[], DefaultListDto>> {
		const { limit, offset, sortField, sortOrder, ...condition } = filter;
		try {
			// const result: User[] = await this.userModel
			//   .find(condition)
			//   .sort({ [sortField]: sortOrder === ESortOrder.ASC ? -1 : 1 })
			//   .limit(+limit)
			//   .skip(+offset);

			const [count, users] = await Promise.all([
				this.userModel.count(condition),
				this.userModel
					.find(condition)
					.sort({ [sortField]: sortOrder === ESortOrder.ASC ? -1 : 1 })
					.limit(+limit)
					.skip(+offset),
			]);

			return {
				filter: filter,
				total: count,
				data: users,
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async createOne(input: CreateUserDto | RegisterDto): Promise<User> {
		try {
			const user = await this.userModel.findOne({ email: input.email });
			if (!user) {
				return this.userModel.create(input);
			}
			throw new BadRequestException('Email has existed!');
		} catch (err) {
			return err;
		}
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

			return;
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
