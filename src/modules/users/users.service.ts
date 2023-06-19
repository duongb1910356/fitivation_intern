import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	getOne() {
		return 'getOne';
	}
	getMany() {
		return 'getMany';
	}
	updateOne() {
		return 'updateOne';
	}
	createOne() {
		return 'createOne';
	}
	deleteOne() {
		return 'deleteOne';
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
