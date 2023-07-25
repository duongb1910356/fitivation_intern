import { CartsService } from 'src/modules/carts/carts.service';
import { UsersService } from '../users.service';
import { PhotoService } from 'src/modules/photo/photo.service';
import { QueryObject } from 'src/shared/utils/query-api';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Gender, User } from '../schemas/user.schema';
import { userStub } from './stubs/user.stub';

jest.mock('../../carts/carts.service');
jest.mock('../../photo/photo.service');

describe('UsersService', () => {
	let usersService: UsersService;
	let cartsService: CartsService;
	let photoService: PhotoService;
	const query: QueryObject = {};
	const userModel: any = {
		findById: jest.fn(),
		findOneAndUpdate: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		deleteOne: jest.fn(),
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

			await usersService.findOneAndUpdate(obj, updateUserDto);
		});

		// it('should throw error if not found user', () => {
		// 	return '';
		// });
	});

	// describe('findOneByID', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('findOneByIDAndUpdate', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('findOneByEmail', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('createOne', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('deleteOne', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('updateMyData', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('updateMyPassword', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('deleteMe', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
	// describe('checkExist', () => {
	// 	it('', () => {
	// 		return '';
	// 	});
	// });
});
