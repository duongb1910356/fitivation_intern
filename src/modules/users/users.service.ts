import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { SignupDto } from '../auth/dto/signup-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import {
	ListResponse,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import { Encrypt } from 'src/shared/utils/encrypt';
import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findMany(query: QueryObject): Promise<ListResponse<User>> {
		const queryFeatures = new QueryAPI(this.userModel, query)
			.filter()
			.sort()
			.limitfields()
			.paginate();

		const users = await queryFeatures.queryModel;

		return {
			total: users.length,
			queryOptions: queryFeatures.queryOptions,
			items: users,
		};
	}

	async findOneAndUpdate(obj: Partial<User>, updateUserDto: UpdateUserDto) {
		const user = await this.userModel.findOneAndUpdate(obj, updateUserDto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('User not found');

		return user;
	}

	async findOneByID(userID: string): Promise<User> {
		const user = await this.userModel.findById(userID);

		if (!user) throw new NotFoundException('Not found user with that ID');

		return user;
	}

	async findOneByIDAndUpdate(
		userID: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		if (updateUserDto.password) {
			updateUserDto.password = await Encrypt.hashData(updateUserDto.password);
		}

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

	async createOne(dto: CreateUserDto | SignupDto): Promise<User> {
		const isExist = await this.checkExist({
			email: dto.email,
			username: dto.username,
		});

		if (isExist.value) throw new BadRequestException(isExist.message);

		dto.password = await Encrypt.hashData(dto.password);

		const user = await this.userModel.create(dto);

		user.refreshToken = undefined;

		return user;
	}

	async deleteOne(userID: string): Promise<boolean> {
		const user = await this.userModel.findById(userID);

		if (!user) throw new BadRequestException('Not found user with that ID');

		await this.userModel.deleteOne({ _id: userID });

		return true;
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

	async getCurrentUser(userID: string) {
		const user = await this.userModel.findById(userID);

		if (!user) throw new NotFoundException('Logged User no longer exists');

		user.password = undefined;
		user.refreshToken = undefined;

		return user;
	}

	async updateMyData(
		userID: string,
		dto: UpdateLoggedUserDataDto,
	): Promise<User> {
		const user = await this.userModel.findByIdAndUpdate(userID, dto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		user.password = undefined;
		user.refreshToken = undefined;

		return user;
	}

	async updateMyPassword(
		userID: string,
		dto: UpdateLoggedUserPasswordDto,
	): Promise<boolean> {
		dto.password = await Encrypt.hashData(dto.password);

		const user = await this.userModel.findByIdAndUpdate(userID, dto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		user.password = undefined;
		user.refreshToken = undefined;

		return true;
	}

	async deleteMe(userID: string): Promise<boolean> {
		const user = await this.userModel.findByIdAndUpdate(
			userID,
			{ status: UserStatus.INACTIVE },
			{
				new: true,
				runValidators: true,
			},
		);

		if (!user) throw new NotFoundException('Not found user with that ID');

		return true;
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
