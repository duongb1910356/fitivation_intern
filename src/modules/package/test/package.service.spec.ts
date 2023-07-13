import { Model } from 'mongoose';
import { PackageService } from '../package.service';
import { Package, TimeType } from '../entities/package.entity';
import { PackageStub } from './stubs/package.stub';
import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from 'src/modules/promotions/promotions.service';
import { getModelToken } from '@nestjs/mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import { CreatePackageDto } from '../dto/create-package-dto';
import { CreatePromotionDto } from 'src/modules/promotions/dto/create-promotion-dto';
import {
	CustomerType,
	PromotionMethod,
	PromotionType,
} from 'src/modules/promotions/schemas/promotion.schema';
import { PackagePromotionStub } from 'src/modules/promotions/test/stubs/promotion.stub';
import { UpdatePromotionDto } from 'src/modules/promotions/dto/update-promotion-dto';

jest.mock('../../promotions/promotions.service');
describe('PackageTypeService', () => {
	const packageStub = PackageStub();
	let packageModel: Model<Package>;
	let packageService: PackageService;
	let promotionService: PromotionsService;

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
		updateOne: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(Package.name),
					useValue: mockModel,
				},
				PackageService,
				PromotionsService,
			],
		}).compile();

		packageService = module.get<PackageService>(PackageService);
		packageModel = module.get<Model<Package>>(getModelToken(Package.name));
		promotionService = module.get<PromotionsService>(PromotionsService);
	});

	it('packageService should be defined', () => {
		expect(packageService).toBeDefined();
	});
	it('packageTypeModel should be defined', () => {
		expect(packageModel).toBeDefined();
	});
	it('promotionService should be defined', () => {
		expect(promotionService.findOneByID).toBeDefined();
	});

	describe('findOneByID', () => {
		let packageData: Package;
		it('should throw a NotFoundException if package not found', async () => {
			jest.spyOn(mockModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(undefined),
			}));

			expect(packageService.findOneByID(packageStub._id)).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should return a package if package exists', async () => {
			jest.spyOn(mockModel, 'findById').mockImplementation(() => ({
				populate: jest.fn().mockResolvedValue(packageStub),
			}));

			packageData = await packageService.findOneByID(packageStub._id);

			expect(packageData).toEqual(packageStub);
		});
	});

	describe('findMany', () => {
		it('should return a package', async () => {
			const filter: ListOptions<Package> = {
				limit: 10,
				offset: 0,
				search: 'gym',
				sortField: 'createdAt',
				sortOrder: 'asc',
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([packageStub]),
					}),
				}),
			}));

			const result = await packageService.findMany(filter);

			expect(result).toEqual({
				items: [packageStub],
				total: [packageStub].length,
				options: filter,
			});
		});
	});

	describe('findManyByPackageType', () => {
		it('should return a packageType', async () => {
			const filter: ListOptions<Package> = {
				limit: 10,
				offset: 0,
				search: 'gym',
				sortField: 'createdAt',
				sortOrder: 'asc',
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([packageStub]),
					}),
				}),
			}));

			const result = await packageService.findManyByPackageType(
				packageStub.packageTypeID._id,
				filter,
			);

			expect(result).toEqual({
				items: [packageStub],
				total: [packageStub].length,
				options: filter,
			});
		});
	});

	describe('countNumberOfPackageByPackageType', () => {
		const packageTypeID = '6493cd02a6a031e19d380fac';
		it('should return 0 if not fo package', async () => {
			jest.spyOn(mockModel, 'find').mockReturnValueOnce(undefined);

			const result = await packageService.countNumberOfPackageByPackageType(
				packageTypeID,
			);

			expect(mockModel.find).toHaveBeenCalledWith({ packageTypeID });

			expect(result).toBe(0);
		});
		it('should return number of package', async () => {
			const packageStubs = [
				{
					_id: 'package 1',
					packageTypeID: {
						_id: '6493cd02a6a031e19d380fac',
					},
					type: TimeType.ONE_MONTH,
					price: 100000,
				},
				{
					_id: 'package 2',
					packageTypeID: {
						_id: '6493cd02a6a031e19d380fac',
					},
					type: TimeType.TWO_MONTH,
					price: 200000,
				},
			];

			jest.spyOn(mockModel, 'find').mockReturnValueOnce(packageStubs);

			const result = await packageService.countNumberOfPackageByPackageType(
				packageTypeID,
			);

			expect(mockModel.find).toHaveBeenCalledWith({ packageTypeID });

			expect(result).toBe(2);
		});
	});

	describe('create package', () => {
		it('should return package', async () => {
			const packageTypeID = '6493cd02a6a031e19d380fac';
			const facilityID = '64931e19d380fac3cd02a6a0';
			const data: CreatePackageDto = {
				type: TimeType.ONE_MONTH,
				price: 100000,
				benefits: ['Use of bathroom', 'Use of massage chair'],
			};

			jest.spyOn(mockModel, 'create').mockResolvedValueOnce(packageStub);

			const result = await packageService.create(
				packageTypeID,
				facilityID,
				data,
			);

			expect(mockModel.create).toHaveBeenCalledWith({
				...data,
				packageTypeID,
				facilityID,
			});

			expect(result).toEqual(packageStub);
		});
	});

	describe('isOwner', () => {
		it('should return true if is Owner', async () => {
			const uid = '123123123123123123123123';

			jest
				.spyOn(packageService, 'findOneByID')
				.mockResolvedValueOnce(packageStub);

			const result = await packageService.isOwner(packageStub._id, uid);

			expect(packageService.findOneByID).toHaveBeenCalledWith(
				packageStub._id,
				'facilityID',
			);

			expect(result).toBe(true);
		});
		it('should return false if is not Owner', async () => {
			const uid = '456454645645645645645464';

			jest
				.spyOn(packageService, 'findOneByID')
				.mockResolvedValueOnce(packageStub);

			const result = await packageService.isOwner(packageStub._id, uid);

			expect(packageService.findOneByID).toHaveBeenCalledWith(
				packageStub._id,
				'facilityID',
			);

			expect(result).toBe(false);
		});
	});

	describe('create Promotion', () => {
		it('should return a package promotion', async () => {
			const packageID = packageStub._id;
			const data: CreatePromotionDto = {
				name: 'promotion',
				description: 'string',
				value: 10000,
				method: PromotionMethod.NUMBER,
				minPriceApply: 100000,
				maxValue: 10000,
				startDate: new Date('2023-06-22T04:24:34.315Z'),
				endDate: new Date('2023-08-22T04:24:34.315Z'),
				customerType: CustomerType.MEMBER,
			};

			await packageService.createPromotion(packageID, data);

			expect(promotionService.create).toHaveBeenCalledWith({
				targetID: packageID,
				type: PromotionType.PACKAGE,
				...data,
			});
		});
	});

	describe('find Many Promotion', () => {
		it('should return many promotion', async () => {
			const packageID = packageStub._id;

			await packageService.findManyPromotion(packageID);

			expect(promotionService.findMany).toHaveBeenCalledWith({
				targetID: packageID,
			});
		});
	});

	describe('update Promotion', () => {
		it('should throw ForbiddenException if user is not owner of packagePromotion', async () => {
			const req = {
				user: { sub: '456456456456456456456456' },
			};
			const data: UpdatePromotionDto = {
				endDate: new Date('2023-08-22T04:24:34.315Z'),
			};

			jest
				.spyOn(promotionService, 'findOneByID')
				.mockResolvedValue(PackagePromotionStub());

			jest.spyOn(packageService, 'isOwner').mockResolvedValue(false);

			expect(
				packageService.updatePromotion(PackagePromotionStub()._id, data, req),
			).rejects.toThrow(ForbiddenException);
		});
		it('should return a promotion after updated', async () => {
			const req = {
				user: { sub: '456456456456456456456456' },
			};
			const data: UpdatePromotionDto = {
				endDate: new Date('2023-08-22T04:24:34.315Z'),
			};

			jest
				.spyOn(promotionService, 'findOneByID')
				.mockResolvedValueOnce(PackagePromotionStub());

			jest.spyOn(packageService, 'isOwner').mockResolvedValueOnce(true);

			await packageService.updatePromotion(
				PackagePromotionStub()._id,
				data,
				req,
			);

			expect(promotionService.findOneByID).toHaveBeenCalledWith(
				PackagePromotionStub()._id,
			);

			expect(packageService.isOwner).toBeCalledWith(
				PackagePromotionStub().targetID,
				req.user.sub,
			);

			expect(promotionService.update).toBeCalledWith(
				PackagePromotionStub()._id,
				data,
			);
		});
	});

	describe('delete Promotion', () => {
		it('should throw ForbiddenException if user is not owner of packagePromotion', async () => {
			const req = {
				user: { sub: '456456456456456456456456' },
			};

			jest
				.spyOn(promotionService, 'findOneByID')
				.mockResolvedValue(PackagePromotionStub());

			jest.spyOn(packageService, 'isOwner').mockResolvedValue(false);

			expect(
				packageService.deletePromotion(PackagePromotionStub()._id, req),
			).rejects.toThrow(ForbiddenException);
		});
		it('should return a promotion after updated', async () => {
			const req = {
				user: { sub: '456456456456456456456456' },
			};

			jest
				.spyOn(promotionService, 'findOneByID')
				.mockResolvedValueOnce(PackagePromotionStub());

			jest.spyOn(packageService, 'isOwner').mockResolvedValueOnce(true);

			await packageService.deletePromotion(PackagePromotionStub()._id, req);

			expect(promotionService.findOneByID).toHaveBeenCalledWith(
				PackagePromotionStub()._id,
			);

			expect(packageService.isOwner).toBeCalledWith(
				PackagePromotionStub().targetID,
				req.user.sub,
			);

			expect(promotionService.delete).toBeCalledWith(
				PackagePromotionStub()._id,
			);
		});
	});
});
