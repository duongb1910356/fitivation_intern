import { Test, TestingModule } from '@nestjs/testing';
import { PackageTypeService } from '../package-type.service';
import { CounterService } from 'src/modules/counter/counter.service';
import { PackageService } from 'src/modules/package/package.service';
import { getModelToken } from '@nestjs/mongoose';
import { PackageType } from '../entities/package-type.entity';
import { Model } from 'mongoose';
import { PackageTypeStub } from './stubs/package-type.stub';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import { CreatePackageTypeDto } from '../dto/create-package-type-dto';
import { CounterStub } from 'src/modules/counter/test/stubs/counter.stub';
import {
	CountObject,
	TargetObject,
} from 'src/modules/counter/entities/counter.entity';
import { UpdatePackageTypeDto } from '../dto/update-package-type-dto';
import { PackageStub } from 'src/modules/package/test/stubs/package.stub';
import { UpdateOrderDto } from '../dto/update-order-dto';
import { CreatePackageDto } from 'src/modules/package/dto/create-package-dto';
import { Package, TimeType } from 'src/modules/package/entities/package.entity';

jest.mock('../../counter/counter.service');
jest.mock('../../package/package.service');
describe('PackageTypeService', () => {
	const counterStub = CounterStub();
	const packageTypeStub = PackageTypeStub();
	const packageStub = PackageStub();
	let packageTypeService: PackageTypeService;
	let packageTypeModel: Model<PackageType>;
	let packageService: PackageService;
	let counterService: CounterService;

	const mockModel = {
		findOne: jest.fn(),
		findById: jest.fn().mockReturnThis(),
		find: jest.fn().mockReturnThis(),
		populate: jest.fn(),
		sort: jest.fn(),
		limit: jest.fn(),
		skip: jest.fn(),
		exec: jest.fn(),
		save: jest.fn().mockReturnValue(packageTypeStub),
		create: jest.fn(),
		updateOne: jest.fn(),
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

	it('packageTypeService should be defined', () => {
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
				packageTypeService.findOneByID(packageTypeStub._id),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a packageType if packageType exists', async () => {
			jest.spyOn(mockModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(packageTypeStub),
			}));

			packageType = await packageTypeService.findOneByID(packageTypeStub._id);

			expect(packageType).toEqual(packageTypeStub);
		});
	});

	describe('findMany', () => {
		it('should return a packageType', async () => {
			const filter: ListOptions<PackageType> = {
				limit: 10,
				offset: 0,
				search: 'gym',
				sortField: 'createdAt',
				sortOrder: 'asc',
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([packageTypeStub]),
					}),
				}),
			}));

			const result = await packageTypeService.findMany(filter);

			expect(result).toEqual({
				items: [packageTypeStub],
				total: [packageTypeStub].length,
				options: filter,
			});
		});
	});

	describe('findManyByFacility', () => {
		it('should return a packageType', async () => {
			const filter: ListOptions<PackageType> = {
				limit: 10,
				offset: 0,
				search: 'gym',
				sortField: 'createdAt',
				sortOrder: 'asc',
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([packageTypeStub]),
					}),
				}),
			}));

			const result = await packageTypeService.findManyByFacility(
				packageTypeStub.facilityID._id,
				filter,
			);

			expect(result).toEqual({
				items: [packageTypeStub],
				total: [packageTypeStub].length,
				options: filter,
			});
		});
	});

	describe('create', () => {
		const mockCreatePackageTypeDto: CreatePackageTypeDto = {
			name: 'GYM GYM',
			description: 'Các bài tập Gym có PT',
			price: 140000,
		};

		describe('when facility is not having packageType', () => {
			it('should return a packageType', async () => {
				jest
					.spyOn(counterService, 'findOneByCondition')
					.mockResolvedValue(undefined);

				jest.spyOn(counterService, 'create').mockResolvedValue(counterStub);

				jest.spyOn(counterService, 'increase').mockResolvedValue(counterStub);

				jest.spyOn(mockModel, 'create').mockResolvedValue(packageTypeStub);

				const result = await packageTypeService.create(
					packageTypeStub.facilityID._id,
					mockCreatePackageTypeDto,
				);

				expect(counterService.findOneByCondition).toHaveBeenCalledWith({
					targetObject: TargetObject.FACILITY,
					targetID: packageTypeStub.facilityID._id,
					countObject: CountObject.PACKAGE_TYPE,
				});

				expect(counterService.create).toHaveBeenCalledWith({
					targetObject: TargetObject.FACILITY,
					targetID: counterStub.targetID,
					countObject: CountObject.PACKAGE_TYPE,
				});

				expect(counterService.increase).toHaveBeenCalledWith(counterStub._id);

				expect(result).toEqual(packageTypeStub);
			});
		});

		describe('when facility is having packageType', () => {
			it('should return a packageType', async () => {
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
					packageTypeStub.facilityID._id,
					mockCreatePackageTypeDto,
				);

				expect(counterService.findOneByCondition).toHaveBeenCalledWith({
					targetObject: TargetObject.FACILITY,
					targetID: packageTypeStub.facilityID._id,
					countObject: CountObject.PACKAGE_TYPE,
				});

				expect(counterService.increase).toHaveBeenCalledWith(counterStub._id);

				expect(result).toEqual(packageTypeStub);
			});
		});
	});

	describe('update', () => {
		const updateData: UpdatePackageTypeDto = {
			name: 'PackageType 1',
			description: 'string',
			price: 100000,
		};

		it('should throw a NotFoundException if packageType not found', async () => {
			jest.spyOn(mockModel, 'findByIdAndUpdate').mockResolvedValue(undefined);

			expect(
				packageTypeService.update(packageTypeStub._id, updateData),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a packageType', async () => {
			jest
				.spyOn(mockModel, 'findByIdAndUpdate')
				.mockResolvedValue(packageTypeStub);

			const result = await packageTypeService.update(
				packageTypeStub._id,
				updateData,
			);

			expect(result).toEqual(packageTypeStub);
		});
	});

	describe('delete', () => {
		it('should throw a ForbiddenException if packageType having package', async () => {
			jest
				.spyOn(packageService, 'countNumberOfPackageByPackageType')
				.mockResolvedValue(2);

			expect(packageTypeService.delete(packageTypeStub._id)).rejects.toThrow(
				ForbiddenException,
			);
		});

		it('should delete a packageType', async () => {
			jest
				.spyOn(packageTypeService, 'findOneByID')
				.mockResolvedValue(packageTypeStub);

			jest
				.spyOn(packageService, 'countNumberOfPackageByPackageType')
				.mockResolvedValue(0);

			jest
				.spyOn(mockModel, 'findByIdAndDelete')
				.mockResolvedValue(packageTypeStub);

			jest
				.spyOn(packageTypeService, 'decreaseAfterDeletion')
				.mockResolvedValue();

			await packageTypeService.delete(packageTypeStub._id);

			expect(packageTypeService.findOneByID).toHaveBeenCalledWith(
				packageTypeStub._id,
			);

			expect(
				packageService.countNumberOfPackageByPackageType,
			).toHaveBeenCalledWith(packageTypeStub._id);

			expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(
				packageTypeStub._id,
			);

			expect(packageTypeService.decreaseAfterDeletion).toHaveBeenCalledWith(
				packageTypeStub.facilityID._id,
				packageTypeStub.order,
			);
		});
	});

	describe('decreaseAfterDeletion', () => {
		it('should decrease order of the remaining packageType and decrease counter', async () => {
			const packageTypeStubs = [
				{
					_id: 'packageType1',
					facilityID: packageTypeStub.facilityID,
					order: 4,
					save: jest.fn(),
				},
				{
					_id: 'packageType2',
					facilityID: packageTypeStub.facilityID,
					order: 5,
					save: jest.fn(),
				},
				{
					_id: 'packageType3',
					facilityID: packageTypeStub.facilityID,
					order: 6,
					save: jest.fn(),
				},
			];

			jest.spyOn(mockModel, 'find').mockResolvedValue(packageTypeStubs);

			await packageTypeService.decreaseAfterDeletion(
				packageTypeStub.facilityID._id,
				packageTypeStub.order,
			);

			expect(counterService.findOneByCondition).toHaveBeenCalledWith({
				targetObject: TargetObject.FACILITY,
				targetID: packageTypeStub.facilityID._id,
				countObject: CountObject.PACKAGE_TYPE,
			});

			expect(counterService.decrease).toHaveBeenCalledWith(counterStub._id);

			expect(mockModel.find).toHaveBeenCalledWith({
				facilityID: packageTypeStub.facilityID._id,
				order: { $gt: packageTypeStub.order },
			});

			expect(packageTypeStubs[0].order).toBe(3);
			expect(packageTypeStubs[1].order).toBe(4);
			expect(packageTypeStubs[2].order).toBe(5);

			for (const packageType of packageTypeStubs) {
				expect(packageType.save).toBeCalled();
			}
		});
	});

	describe('swapOrder', () => {
		it('should throw a NotFoundException if order1 is not found', async () => {
			const facilityID = packageTypeStub.facilityID._id;
			const data: UpdateOrderDto = { order1: 10, order2: 2 };
			jest
				.spyOn(mockModel, 'findOne')
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(packageTypeStub);

			await expect(
				packageTypeService.swapOrder(facilityID, data),
			).rejects.toThrow(NotFoundException);
		});
		it('should throw a NotFoundException if order2 is not found', async () => {
			const facilityID = packageTypeStub.facilityID._id;
			const data: UpdateOrderDto = { order1: 2, order2: 10 };

			jest
				.spyOn(mockModel, 'findOne')
				.mockResolvedValueOnce(packageTypeStub)
				.mockResolvedValueOnce(undefined);

			await expect(
				packageTypeService.swapOrder(facilityID, data),
			).rejects.toThrow(NotFoundException);
		});
		it('should swap order of two package Type', async () => {
			const facilityID = packageTypeStub.facilityID._id;
			const data: UpdateOrderDto = { order1: 2, order2: 5 };
			const packageTypeStub1 = {
				name: 'GYM GYM 1',
				description: 'cơ sở tập gym chất lượng',
				price: 100000,
				order: 2,
				save: jest.fn(),
			};
			const packageTypeStub2 = {
				name: 'GYM GYM 1',
				description: 'cơ sở tập gym chất lượng',
				price: 100000,
				order: 5,
				save: jest.fn(),
			};

			jest
				.spyOn(mockModel, 'findOne')
				.mockResolvedValueOnce(packageTypeStub1)
				.mockResolvedValueOnce(packageTypeStub2);

			await packageTypeService.swapOrder(facilityID, data);

			expect(mockModel.findOne).toHaveBeenCalledWith({
				facilityID,
				order: data.order1,
			});
			expect(mockModel.findOne).toHaveBeenCalledWith({
				facilityID,
				order: data.order2,
			});

			expect(packageTypeStub1.order).toBe(5);
			expect(packageTypeStub2.order).toBe(2);

			expect(packageTypeStub1.save).toBeCalled();
			expect(packageTypeStub2.save).toBeCalled();
		});
	});

	describe('isOwner', () => {
		it('should return true if is Owner', async () => {
			const uid = '123123123123123123123123';

			jest
				.spyOn(packageTypeService, 'findOneByID')
				.mockResolvedValueOnce(packageTypeStub);

			const result = await packageTypeService.isOwner(packageTypeStub._id, uid);

			expect(packageTypeService.findOneByID).toHaveBeenCalledWith(
				packageTypeStub._id,
				'facilityID',
			);

			expect(result).toBe(true);
		});
		it('should return false if is not Owner', async () => {
			const uid = '456454645645645645645464';

			jest
				.spyOn(packageTypeService, 'findOneByID')
				.mockResolvedValueOnce(packageTypeStub);

			const result = await packageTypeService.isOwner(packageTypeStub._id, uid);

			expect(packageTypeService.findOneByID).toHaveBeenCalledWith(
				packageTypeStub._id,
				'facilityID',
			);

			expect(result).toBe(false);
		});
	});

	describe('getAllPackages', () => {
		it('should get all Package by PackageTypeID', async () => {
			const filter: ListOptions<Package> = {};
			const response = await packageTypeService.getAllPackages(
				packageTypeStub._id,
				filter,
			);

			expect(packageService.findManyByPackageType).toHaveBeenCalledWith(
				packageTypeStub._id,
				filter,
			);

			expect(response).toEqual([packageStub]);
		});
	});

	describe('createPackage', () => {
		it('should return all new package of packageType', async () => {
			const data: CreatePackageDto = {
				type: TimeType.ONE_MONTH,
				price: 100000,
				benefits: ['Use of bathroom', 'Use of massage chair'],
			};
			const facilityID = packageTypeStub.facilityID._id;

			jest
				.spyOn(packageTypeService, 'findOneByID')
				.mockResolvedValue(packageTypeStub);

			jest.spyOn(packageService, 'create').mockResolvedValue(packageStub);

			const response = await packageTypeService.createPackage(
				packageTypeStub._id,
				data,
			);

			expect(packageTypeService.findOneByID).toHaveBeenCalledWith(
				packageTypeStub._id,
			);

			expect(packageService.create).toHaveBeenCalledWith(
				packageTypeStub._id,
				facilityID,
				data,
			);

			expect(response).toEqual(packageStub);
		});
	});
});
