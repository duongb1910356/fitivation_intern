import { Test, TestingModule } from '@nestjs/testing';
import { BillItemsService } from '../bill-items.service';
import { PackageService } from 'src/modules/package/package.service';
import { BrandService } from 'src/modules/brand/brand.service';
import { getModelToken } from '@nestjs/mongoose';
import { BillItem } from '../schemas/bill-item.schema';
import { billItemStub } from './stubs/bill-item.stub';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import { BrandStub } from 'src/modules/brand/test/stubs/brand.stub';
import { PackageType } from 'src/modules/package-type/entities/package-type.entity';
import { Facility } from 'src/modules/facility/schemas/facility.schema';
import { TimeType } from 'src/modules/package/entities/package.entity';

jest.mock('../../package/package.service');
jest.mock('../../brand/brand.service');

describe('BillItemsService', () => {
	let billItemsService: BillItemsService;
	let packageService: PackageService;
	let brandService: BrandService;
	const billItemsModel: any = {
		create: jest.fn(),
		findOne: jest.fn(),
		findById: jest.fn(),
		deleteOne: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(BillItem.name),
					useValue: billItemsModel,
				},
				BillItemsService,
				PackageService,
				BrandService,
			],
		}).compile();

		billItemsService = moduleRef.get<BillItemsService>(BillItemsService);
		packageService = moduleRef.get<PackageService>(PackageService);
		brandService = moduleRef.get<BrandService>(BrandService);
	});

	it('should be defined', () => {
		expect(billItemsService).toBeDefined();
		expect(packageService).toBeDefined();
		expect(brandService).toBeDefined();
	});

	describe('findOneByCondition', () => {
		const condition = { _id: '64b5fb7409c136b1b2789dc6' };
		it('should return a bill-item', async () => {
			jest.spyOn(billItemsModel, 'findOne').mockResolvedValue(billItemStub());

			const result = await billItemsService.findOneByCondition(condition);

			expect(billItemsModel.findOne).toHaveBeenCalledWith(condition);

			expect(result).toEqual(billItemStub());
		});

		it('should throw not found exception if not found bill-item', () => {
			jest.spyOn(billItemsModel, 'findOne').mockResolvedValue(undefined);

			expect(
				billItemsService.findOneByCondition({ _id: 'other id' }),
			).rejects.toEqual(new NotFoundException('Not found bill-item'));
		});
	});

	describe('findOneByID', () => {
		const billItemID = '64b5fb7409c136b1b2789dc6';
		let user = {
			sub: '649a8f8ab185ffb672485391',
			role: UserRole.MEMBER,
		};

		it('should return a bill item', async () => {
			jest.spyOn(billItemsModel, 'findById').mockResolvedValue(billItemStub());

			const result = await billItemsService.findOneByID(billItemID, user);

			expect(billItemsModel.findById).toHaveBeenCalledWith(billItemID);

			expect(result).toEqual(billItemStub());
		});

		it('should throw not found exception when bill-item is not belong current customer', () => {
			user = {
				sub: 'other id',
				role: UserRole.MEMBER,
			};

			jest.spyOn(billItemsModel, 'findById').mockResolvedValue(billItemStub());

			expect(billItemsService.findOneByID(billItemID, user)).rejects.toEqual(
				new ForbiddenException('Forbidden resource'),
			);
		});

		it('should throw forbidden exception when bill-item is not belong current facility owner', () => {
			user = {
				sub: 'other id',
				role: UserRole.FACILITY_OWNER,
			};

			jest.spyOn(billItemsModel, 'findById').mockResolvedValue(billItemStub());

			jest.spyOn(packageService, 'isOwner').mockResolvedValue(false);

			expect(billItemsService.findOneByID(billItemID, user)).rejects.toEqual(
				new ForbiddenException('Forbidden resource'),
			);
		});
	});

	describe('createOne', () => {
		const packageID = '649dd2e7e895344f72e91c42';
		const userID = '649a8f8ab185ffb672485391';
		const packageStub = {
			_id: '6476ef7d1f0419cd330fe128',
			packageTypeID: {
				_id: '6493cd02a6a031e19d380fac',
				price: 1,
				name: 'name',
				description: 'description',
			} as unknown as PackageType,
			facilityID: {
				_id: '64931e19d380fac3cd02a6a0',
				ownerID: userID,
				brandID: BrandStub()._id,
				name: 'name',
				address: {
					street: 'street',
					province: 'province',
					provinceCode: 'provinceCode',
					district: 'district',
					districtCode: 'districtCode',
					commune: 'commune',
					communeCode: 'communeCode',
				},
				location: {
					coordinates: [105.77827419395031, 10.044071865857335],
					type: 'Point',
					index: '2dsphere',
				},
				photos: [
					{
						createdAt: new Date('2023-06-29T07:36:22.758Z'),
						updatedAt: new Date('2023-06-29T07:36:22.758Z'),
						ownerID: '649d344f72e91c40d2e7e895',
						name: '1688024182737-366333986.jpeg',
						imageURL:
							'https://hdfitness.vn/wp-content/uploads/2022/02/tap-gym-la-gi-5-min-scaled.jpg',
						_id: '649d347672e91c40d2e7e89c',
					},
				],
			} as unknown as Facility,
			type: TimeType.ONE_MONTH,
			price: 100000,
			benefits: ['Use of bathroom', 'Use of massage chair'],
			createdAt: new Date('2023-06-22T04:24:34.315Z'),
			updatedAt: new Date('2023-06-22T04:24:34.315Z'),
		};
		const brandStub = BrandStub();

		it('should return a billItem', async () => {
			jest.spyOn(packageService, 'findOneByID').mockResolvedValue(packageStub);
			jest.spyOn(brandService, 'findOneByID').mockResolvedValue(brandStub);
			jest.spyOn(billItemsModel, 'create').mockResolvedValue(billItemStub());
			const result = await billItemsService.createOne(packageID, userID);

			expect(packageService.findOneByID).toHaveBeenCalledWith(
				packageID,
				'packageTypeID facilityID',
			);

			expect(brandService.findOneByID).toHaveBeenCalledWith(
				packageStub.facilityID.brandID,
			);

			expect(billItemsModel.create).toHaveBeenCalledWith({
				brandID: brandStub._id.toString(),
				facilityID: packageStub.facilityID._id.toString(),
				packageTypeID: packageStub.packageTypeID._id.toString(),
				packageID: packageID.toString(),
				ownerFacilityID: packageStub.facilityID.ownerID.toString(),
				accountID: userID,
				facilityInfo: {
					brandName: brandStub.name,
					facilityName: packageStub.facilityID.name,
					facilityAddress: {
						street: packageStub.facilityID.address.street,
						province: packageStub.facilityID.address.province,
						provinceCode: packageStub.facilityID.address.provinceCode,
						district: packageStub.facilityID.address.district,
						districtCode: packageStub.facilityID.address.districtCode,
						commune: packageStub.facilityID.address.commune,
						communeCode: packageStub.facilityID.address.communeCode,
					},
					facilityCoordinatesLocation: packageStub.facilityID.location,
					facilityPhotos: packageStub.facilityID.photos,
				},
				packageTypeInfo: {
					name: packageStub.packageTypeID.name,
					description: packageStub.packageTypeID.description,
					price: packageStub.packageTypeID.price,
				},
				packageInfo: {
					type: packageStub.type,
					price: packageStub.price,
				},
				promotions: [],
				promotionPrice: 0,
				totalPrice: packageStub.price,
			});

			expect(result).toEqual(billItemStub());
		});
	});

	describe('deleteOneByID', () => {
		const billItemID = 'billItemID';

		it('should return true', async () => {
			jest.spyOn(billItemsModel, 'findById').mockResolvedValue(billItemStub());
			jest.spyOn(billItemsModel, 'deleteOne').mockResolvedValue(billItemStub());

			const result = await billItemsService.deleteOneByID(billItemID);

			expect(result).toEqual(true);
		});

		it('should return false', async () => {
			jest.spyOn(billItemsModel, 'findById').mockResolvedValue(undefined);
			jest.spyOn(billItemsModel, 'deleteOne').mockResolvedValue(undefined);

			const result = await billItemsService.deleteOneByID(billItemID);

			expect(result).toEqual(false);
		});
	});
});
