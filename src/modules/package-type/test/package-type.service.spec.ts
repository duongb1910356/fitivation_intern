import { Test, TestingModule } from '@nestjs/testing';
import { PackageTypeService } from '../package-type.service';
import { CounterService } from 'src/modules/counter/counter.service';
import { PackageService } from 'src/modules/package/package.service';
import { getModelToken } from '@nestjs/mongoose';
import { PackageType } from '../entities/package-type.entity';
import { Model } from 'mongoose';
import { PackageTypeStub } from './stubs/package-type.stub';
import { NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import { CreatePackageTypeDto } from '../dto/create-package-type-dto';
import { CounterStub } from 'src/modules/counter/test/stubs/counter.stub';
import {
	CountObject,
	TargetObject,
} from 'src/modules/counter/entities/counter.entity';

jest.mock('../../counter/counter.service');
jest.mock('../../package/package.service');
describe('PackageTypeService', () => {
	let packageTypeService: PackageTypeService;
	let packageTypeModel: Model<PackageType>;
	let packageService: PackageService;
	let counterService: CounterService;

	const mockModel = {
		findOne: jest.fn(),
		findById: jest.fn().mockImplementation(() => ({
			populate: jest.fn().mockReturnValue(PackageTypeStub()),
		})),
		find: jest.fn().mockImplementation(() => ({
			sort: () => ({
				limit: () => ({
					skip: jest.fn().mockResolvedValue([PackageTypeStub()]),
				}),
			}),
		})),
		create: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PackageTypeService,
				{
					provide: getModelToken(PackageType.name),
					useValue: mockModel,
				},
				CounterService,
				PackageService,
			],
		}).compile();

		packageTypeService = module.get<PackageTypeService>(PackageTypeService);
		packageTypeModel = module.get<Model<PackageType>>(
			getModelToken(PackageType.name),
		);
		packageService = module.get<PackageService>(PackageService);
		counterService = module.get<CounterService>(CounterService);
	});

	it('should be defined', () => {
		expect(packageTypeService).toBeDefined();
	});
	it('packageTypeModel should be defined', () => {
		expect(packageTypeModel).toBeDefined();
	});

	describe('findOneByID', () => {
		let packageType: PackageType;

		it('should throw a NotFoundException if packageType not found', async () => {
			jest.spyOn(mockModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(undefined),
			}));

			expect(
				packageTypeService.findOneByID(PackageTypeStub()._id),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a packageType if packageType exists', async () => {
			jest.spyOn(mockModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(PackageTypeStub()),
			}));

			packageType = await packageTypeService.findOneByID(PackageTypeStub()._id);

			expect(packageType).toEqual(PackageTypeStub());
		});
	});

	describe('findMany', () => {
		const filter: ListOptions<PackageType> = {
			limit: 10,
			offset: 0,
			search: 'gym',
			sortField: 'createdAt',
			sortOrder: 'asc',
		};

		it('should throw a NotFoundException if packageType not found', () => {
			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([]),
					}),
				}),
			}));

			expect(packageTypeService.findMany(filter)).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should return a packageType', async () => {
			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([PackageTypeStub()]),
					}),
				}),
			}));

			const result = await packageTypeService.findMany(filter);

			expect(result).toEqual({
				items: [PackageTypeStub()],
				total: [PackageTypeStub()].length,
				options: filter,
			});
		});
	});

	describe('findManyByFacility', () => {
		const filter: ListOptions<PackageType> = {
			limit: 10,
			offset: 0,
			search: 'gym',
			sortField: 'createdAt',
			sortOrder: 'asc',
		};

		it('should throw a NotFoundException if packageType not found', () => {
			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([]),
					}),
				}),
			}));

			expect(
				packageTypeService.findManyByFacility(
					PackageTypeStub().facilityID._id,
					filter,
				),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a packageType', async () => {
			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([PackageTypeStub()]),
					}),
				}),
			}));

			const result = await packageTypeService.findManyByFacility(
				PackageTypeStub().facilityID._id,
				filter,
			);

			expect(result).toEqual({
				items: [PackageTypeStub()],
				total: [PackageTypeStub()].length,
				options: filter,
			});
		});
	});

	describe('create', () => {
		describe('when facility is not having packageType', () => {
			it('should return a packageType', async () => {
				const counterStub = CounterStub();
				const packageTypeStub = PackageTypeStub();
				const mockCreatePackageTypeDto: CreatePackageTypeDto = {
					name: 'GYM GYM',
					description: 'Các bài tập Gym có PT',
					price: 140000,
				};

				jest
					.spyOn(counterService, 'findOneByCondition')
					.mockResolvedValue(undefined);

				jest.spyOn(counterService, 'create').mockResolvedValue(counterStub);

				jest.spyOn(counterService, 'increase').mockResolvedValue(counterStub);

				jest.spyOn(mockModel, 'create').mockResolvedValue(packageTypeStub);

				const result = await packageTypeService.create(
					PackageTypeStub().facilityID._id,
					mockCreatePackageTypeDto,
				);

				expect(counterService.findOneByCondition).toHaveBeenCalled();

				expect(counterService.create).toHaveBeenCalledWith({
					targetObject: TargetObject.FACILITY,
					targetID: counterStub.targetID,
					countObject: CountObject.PACKAGE_TYPE,
				});

				expect(counterService.increase).toHaveBeenCalled();

				expect(result).toEqual(packageTypeStub);
			});
		});

		describe('when facility is having packageType', () => {
			it('should return a packageType', async () => {
				const counterStub = CounterStub();
				const packageTypeStub = PackageTypeStub();
				const mockCreatePackageTypeDto: CreatePackageTypeDto = {
					name: 'GYM GYM',
					description: 'Các bài tập Gym có PT',
					price: 140000,
				};

				jest
					.spyOn(counterService, 'findOneByCondition')
					.mockResolvedValue(counterStub);

				jest.spyOn(counterService, 'increase').mockResolvedValue(counterStub);

				jest.spyOn(mockModel, 'create').mockResolvedValue(packageTypeStub);

				const result = await packageTypeService.create(
					PackageTypeStub().facilityID._id,
					mockCreatePackageTypeDto,
				);

				expect(counterService.findOneByCondition).toHaveBeenCalled();

				expect(counterService.increase).toHaveBeenCalled();

				expect(result).toEqual(packageTypeStub);
			});
		});
	});
});

// it('should call packageTypeModel.findById', async () => {
// 	packageType = await packageTypeService.findOneByID(
// 		PackageTypeStub()._id,
// 	);
// 	expect(mockModel.findById).toBeCalledWith(PackageTypeStub()._id);
// });

// const conditon: object = {
// 	$or: [
// 		{ name: { $regex: filter.search } },
// 		{ description: { $regex: filter.search } },
// 	],
// 	optionals: {},
// };

// it('should call packageTypeModel.find', async () => {
// 	await packageTypeService.findMany(filter);
// 	expect(mockModel.find).toBeCalledWith(conditon);
// });
