import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { SignupDto } from '../auth/dto/signup-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	findMany() {
		return 'getMany';
	}

	findOne() {
		return 'getOne';
	}

	async findByIDAndUpdate(
		userID: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		const user = await this.userModel.findByIdAndUpdate(userID, updateUserDto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		return user;
	}

	async findOneByEmail(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email });

		if (!user) throw new NotFoundException('Email not exists');

		return user;
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
