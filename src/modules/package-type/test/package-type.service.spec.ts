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
		save: jest.fn(),
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
				packageTypeService.findOneByID(packageTypeStub._id),
			).rejects.toThrow(NotFoundException);
		});

		it('should return a packageType if packageType exists', async () => {
			jest.spyOn(mockModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(PackageTypeStub()),
			}));

			packageType = await packageTypeService.findOneByID(packageTypeStub._id);

			expect(packageType).toEqual(PackageTypeStub());
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

	// describe('decreaseAfterDeletion', () => {
	// 	it('should decrease order of the remaining packageType and decrease counter', async () => {
	// 		await packageTypeService.decreaseAfterDeletion(
	// 			packageTypeStub.facilityID._id,
	// 			packageTypeStub.order,
	// 		);

	// 		expect(counterService.findOneByCondition).toHaveBeenCalledWith({
	// 			targetObject: TargetObject.FACILITY,
	// 			targetID: packageTypeStub.facilityID._id,
	// 			countObject: CountObject.PACKAGE_TYPE,
	// 		});

	// 		expect(counterService.decrease).toHaveBeenCalledWith(counterStub._id);

	// 		expect(findMock).toHaveBeenCalledWith({
	// 			facilityID: packageTypeStub.facilityID._id,
	// 			order: { $gt: packageTypeStub.order },
	// 		});

	// 		expect(packageTypeModelMock.exec).toHaveBeenCalled();
	// 		expect(packageTypeModelMock.save).toHaveBeenCalledTimes(3);
	// 	});
	// });
});
