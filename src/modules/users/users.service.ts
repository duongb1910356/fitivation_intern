import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	User,
	UserDocument,
	UserRole,
	UserStatus,
} from './schemas/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';
import { SignupDto } from '../auth/dto/signup-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import {
	ListResponseV2,
	QueryAPI,
	QueryObject,
} from 'src/shared/utils/query-api';
import { Encrypt } from 'src/shared/utils/encrypt';
import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';
import { CartsService } from '../carts/carts.service';
import { PhotoService } from '../photo/photo.service';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectStripe() private readonly stripe: Stripe,
		private cartService: CartsService,
		private photoService: PhotoService,
	) {}

	async getQuantityUsersStats(): Promise<object> {
		const numberUsers = await this.userModel
			.find({ role: { $ne: UserRole.ADMIN } })
			.count();

		return { numberUsers };
	}

	async getQuantityCustomersStats(): Promise<object> {
		const numberCustomers = await this.userModel
			.find({ role: UserRole.MEMBER })
			.count();

		return { numberCustomers };
	}

	async getQuantityFacilityOwnersStats(): Promise<object> {
		const numFacilityOwners = await this.userModel
			.find({ role: UserRole.FACILITY_OWNER })
			.count();

		return { numFacilityOwners };
	}

	async updateAvatar(
		userID: string,
		file: Express.Multer.File,
	): Promise<boolean> {
		if (isValidObjectId(userID) && file) {
			const user = await this.userModel.findById(userID);
			await this.photoService.delete(user.avatar?._id);
			const avatar = await this.photoService.uploadOneFile(userID, file);
			user.avatar = avatar;
			if (!(await user.save())) {
				throw new BadRequestException("User's not update ");
			}
			return true;
		}
		throw new BadRequestException('[Input] invalid');
	}

	async findMany(query: QueryObject): Promise<ListResponseV2<User>> {
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

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length !== 0) {
			await this.stripe.customers.update(stripeCustomer.data[0].id, {
				email: user.email,
				name: user.username,
				address: {
					city: updateUserDto.address?.province,
					line1: updateUserDto.address?.district,
					line2: updateUserDto.address?.commune,
				},
				phone: updateUserDto?.tel,
				metadata: {
					gender: updateUserDto?.gender,
					firstName: updateUserDto?.firstName,
					lastName: updateUserDto?.lastName,
				},
			});
		}

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

		if (user.role === UserRole.MEMBER) {
			await this.cartService.createOne(user._id);
			await this.stripe.customers.create({
				email: user.email,
				name: user.username,
				address: {
					city: dto.address?.province,
					line1: dto.address?.district,
					line2: dto.address?.commune,
				},
				phone: dto?.tel,
				metadata: {
					gender: dto?.gender,
					firstName: dto?.firstName,
					lastName: dto?.lastName,
					status: UserStatus.ACTIVE,
				},
			});
		}

		return user;
	}

	async deleteOne(userID: string): Promise<boolean> {
		const user = await this.userModel.findById(userID);

		if (!user) throw new NotFoundException('Not found user with that ID');

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length !== 0)
			await this.stripe.customers.del(stripeCustomer.data[0].id);

		await this.cartService.deleteOne(userID);

		await this.userModel.deleteOne({ _id: userID });

		return true;
	}

	// async updateAvatar(userId: string, filePath: string): Promise<User> {
	// 	try {
	// 		return await this.userModel.findByIdAndUpdate(
	// 			userId,
	// 			{
	// 				avatar: filePath,
	// 			},
	// 			{
	// 				new: true,
	// 			},
	// 		);
	// 	} catch (err) {
	// 		throw new InternalServerErrorException(err);
	// 	}
	// }

	async getCurrentUser(userID: string): Promise<User> {
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

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length !== 0) {
			await this.stripe.customers.update(stripeCustomer.data[0].id, {
				email: user.email,
				name: user.username,
				address: {
					city: dto.address?.province,
					line1: dto.address?.district,
					line2: dto.address?.commune,
				},
				phone: dto?.tel,
				metadata: {
					gender: dto?.gender,
					firstName: dto?.firstName,
					lastName: dto?.lastName,
				},
			});
		}

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

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length !== 0) {
			await this.stripe.customers.update(stripeCustomer.data[0].id, {
				metadata: {
					status: UserStatus.INACTIVE,
				},
			});
		}

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
