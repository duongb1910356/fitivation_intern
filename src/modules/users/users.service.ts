import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { SignupDto } from '../auth/dto/signup-dto';

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
	async createOne(dto: CreateUserDto | SignupDto): Promise<User> {
		const isExist = await this.checkExist({
			email: dto.email,
			username: dto.username,
		});

		if (isExist.value) throw new BadRequestException(isExist.message);

		const user = await this.userModel.create(dto);
		user.refreshToken = undefined;
		return user;
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

	async checkExist(uniqueFieldObj: {
		username: string;
		email: string;
	}): Promise<{ value: boolean; message: string }> {
		const isEmailExisted =
			(await this.userModel.exists({ email: uniqueFieldObj.email })) === null
				? false
				: true;

		if (isEmailExisted)
			return {
				value: true,
				message: 'Email already exists',
			};

		const isUsernameExisted =
			(await this.userModel.exists({ username: uniqueFieldObj.username })) ===
			null
				? false
				: true;

		if (isUsernameExisted)
			return {
				value: true,
				message: 'Username already exists',
			};

		return {
			value: false,
			message: null,
		};
	}
}
