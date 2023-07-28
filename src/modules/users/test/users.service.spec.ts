import { CartsService } from 'src/modules/carts/carts.service';
import { UsersService } from '../users.service';
import { PhotoService } from 'src/modules/photo/photo.service';
import { QueryObject } from 'src/shared/utils/query-api';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender, User, UserRole } from '../schemas/user.schema';
import { userStub } from './stubs/user.stub';
import { stripeToken } from 'nestjs-stripe';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('../../carts/carts.service');
jest.mock('../../photo/photo.service');

describe('UsersService', () => {
	let usersService: UsersService;
	let cartsService: CartsService;
	let photoService: PhotoService;
	const query: QueryObject = {};
	const stripeService = {
		customers: {
			search: () => {
				return {
					data: [],
				};
			},
			update: () => {
				return {};
			},
			create: () => {
				return {};
			},
			del: () => {
				return {};
			},
		},
	};
	const userModel: any = {
		findById: jest.fn(),
		findOneAndUpdate: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		deleteOne: jest.fn(),
		exists: jest.fn(),
		find: jest.fn(() => {
			return {
				sort: () => {
					return {
						select: () => {
							return {
								skip: () => {
									return {
										limit: () => {
											return jest.fn();
										},
									};
								},
							};
						},
					};
				},
			};
		}),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(User.name),
					useValue: userModel,
				},
				{
					provide: stripeToken,
					useValue: stripeService,
				},
				UsersService,
				CartsService,
				PhotoService,
			],
		}).compile();

		usersService = moduleRef.get<UsersService>(UsersService);
		cartsService = moduleRef.get<CartsService>(CartsService);
		photoService = moduleRef.get<PhotoService>(PhotoService);

		jest.clearAllMocks();
	});

	it(`should be defined it's service and dependencies`, () => {
		expect(usersService).toBeDefined();
		expect(cartsService).toBeDefined();
		expect(photoService).toBeDefined();
	});

	// describe('updateAvatar', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });

	describe('findMany', () => {
		it('should return array', async () => {
			const mockUserModel = {
				sort: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnValueOnce([userStub()]),
			};

			jest.spyOn(userModel, 'find').mockImplementationOnce(() => mockUserModel);

			const result = await usersService.findMany(query);

			expect(result.items).toEqual([userStub()]);
		});
	});

	describe('findOneAndUpdate', () => {
		it('should return user', async () => {
			jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValue(userStub());

			const obj = {
				email: 'customer1@gmail.com',
			};

			const updateUserDto = {
				gender: Gender.FEMALE,
			};

			const user = await usersService.findOneAndUpdate(obj, updateUserDto);

			expect(user).toEqual(userStub());
		});

		it('should throw error if not found user', () => {
			jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValue(undefined);

			const obj = {
				email: 'customer1@gmail.com',
			};

			const updateUserDto = {
				gender: Gender.FEMALE,
			};

			expect(usersService.findOneAndUpdate(obj, updateUserDto)).rejects.toEqual(
				new NotFoundException('User not found'),
			);
		});
	});

	describe('findOneByID', () => {
		const userID = '649a8f8ab185ffb672485391';
		it('should return a user', async () => {
			jest.spyOn(userModel, 'findById').mockResolvedValue(userStub());

			const user = await usersService.findOneByID(userID);

			expect(user).toEqual(userStub());
		});

		it('should throw error if not found user with userID', async () => {
			jest.spyOn(userModel, 'findById').mockResolvedValue(undefined);

			expect(usersService.findOneByID(userID)).rejects.toEqual(
				new NotFoundException('Not found user with that ID'),
			);
		});
	});

	describe('findOneByIDAndUpdate', () => {
		const userID = '649a8f8ab185ffb672485391';

		const updateUserDto = {
			gender: Gender.FEMALE,
		};

		it('should throw error if not found user with userID', async () => {
			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(undefined);

			expect(
				usersService.findOneByIDAndUpdate(userID, updateUserDto),
			).rejects.toEqual(new NotFoundException('Not found user with that ID'));
		});

		it('should  user', async () => {
			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(userStub());

			const user = await usersService.findOneByIDAndUpdate(
				userID,
				updateUserDto,
			);

			expect(user).toEqual(userStub());
		});
	});

	describe('findOneByEmail', () => {
		const email = 'member@test.com';
		it('Should return a user', async () => {
			jest.spyOn(userModel, 'findOne').mockResolvedValue(userStub());

			const user = await usersService.findOneByEmail(email);

			expect(user).toEqual(userStub());
		});

		it('Should throw error if email not exist', async () => {
			jest.spyOn(userModel, 'findOne').mockResolvedValue(undefined);

			expect(usersService.findOneByEmail(email)).rejects.toEqual(
				new NotFoundException('Email not exists'),
			);
		});
	});

	describe('createOne', () => {
		const dto = {
			role: UserRole.MEMBER,
			username: 'member',
			email: 'member@test.com',
			password: '123123123',
			displayName: 'Member user',
			firstName: 'string',
			lastName: 'string',
			gender: Gender.MALE,
			birthDate: new Date('2023-07-01T11:26:17.640Z'),
			tel: '0888888888',
			address: {
				province: 'Can Tho',
				district: 'Ninh Kieu',
				commune: 'Xuan Khanh',
			},
			isMember: false,
		};

		it('should return a user', async () => {
			jest.spyOn(usersService, 'checkExist').mockResolvedValue({
				value: false,
				message: null,
			});

			jest.spyOn(userModel, 'create').mockResolvedValue(userStub());

			const user: User = await usersService.createOne(dto);

			expect(user).toBeDefined();
			expect(user.password).not.toEqual(dto.password);
		});

		it('should throw error if email or username was exist', async () => {
			jest.spyOn(usersService, 'checkExist').mockResolvedValue({
				value: true,
				message: 'Email already exists',
			});

			expect(usersService.createOne(dto)).rejects.toEqual(
				new BadRequestException('Email already exists'),
			);
		});
	});

	describe('deleteOne', () => {
		const userID = '649a8f8ab185ffb672485391';

		it('should return true', async () => {
			jest.spyOn(userModel, 'findById').mockResolvedValue(userStub());
			jest.spyOn(cartsService, 'deleteOne').mockResolvedValue(true);
			jest.spyOn(userModel, 'deleteOne').mockResolvedValue(userStub());

			const result = await usersService.deleteOne(userID);

			expect(result).toEqual(true);
		});

		it('should throw error if not found user with userID', async () => {
			jest.spyOn(userModel, 'findById').mockResolvedValue(undefined);
			jest.spyOn(cartsService, 'deleteOne').mockResolvedValue(true);
			jest.spyOn(userModel, 'deleteOne').mockResolvedValue(userStub());

			expect(usersService.deleteOne(userID)).rejects.toEqual(
				new NotFoundException('Not found user with that ID'),
			);
		});
	});

	describe('updateMyData', () => {
		const userID = '649a8f8ab185ffb672485391';

		const dto = {
			gender: Gender.FEMALE,
		};

		it('should return user', async () => {
			const stub = userStub();
			stub.password = undefined;
			stub.refreshToken = undefined;

			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(stub);

			const user = await usersService.updateMyData(userID, dto);
			expect(user).toEqual(stub);
		});

		it('should throw error if not found user with userID', async () => {
			const stub = userStub();
			stub.password = undefined;
			stub.refreshToken = undefined;

			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(undefined);

			expect(usersService.updateMyData(userID, dto)).rejects.toEqual(
				new NotFoundException('Not found user with that ID'),
			);
		});
	});

	describe('updateMyPassword', () => {
		const dto = {
			password: '456456456',
		};
		const userID = '649a8f8ab185ffb672485391';
		it('should return true', async () => {
			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(userStub());

			const result = await usersService.updateMyPassword(userID, dto);

			expect(result).toEqual(true);
		});

		it('should throw error if not found user with userID', async () => {
			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(undefined);

			expect(usersService.updateMyPassword(userID, dto)).rejects.toEqual(
				new NotFoundException('Not found user with that ID'),
			);
		});
	});

	describe('deleteMe', () => {
		const userID = '649a8f8ab185ffb672485391';

		it('should return true', async () => {
			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(userStub());

			const user = await usersService.deleteMe(userID);

			expect(user).toEqual(true);
		});

		it('should throw error if not found user with userID', async () => {
			jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(undefined);

			expect(usersService.deleteMe(userID)).rejects.toEqual(
				new NotFoundException('Not found user with that ID'),
			);
		});
	});

	describe('checkExist', () => {
		const username = 'member1';
		const email = 'member1@test.com';

		it('Should return false if not found exist', async () => {
			jest.spyOn(userModel, 'exists').mockResolvedValueOnce(null);
			jest.spyOn(userModel, 'exists').mockResolvedValueOnce(null);

			const result = await usersService.checkExist({
				username,
				email,
			});

			expect(result.value).toEqual(false);
		});

		it('Should return email already exists', async () => {
			jest.spyOn(userModel, 'exists').mockResolvedValueOnce({
				value: true,
				message: 'Email already exists',
			});

			const result = await usersService.checkExist({
				username,
				email,
			});

			expect(result).toEqual({
				value: true,
				message: 'Email already exists',
			});
		});

		it('Should return username already exists', async () => {
			jest.spyOn(userModel, 'exists').mockResolvedValueOnce(null);
			jest.spyOn(userModel, 'exists').mockResolvedValueOnce({
				value: true,
				message: 'Username already exists',
			});

			const result = await usersService.checkExist({
				username,
				email,
			});

			expect(result).toEqual({
				value: true,
				message: 'Username already exists',
			});
		});
	});
});
