import { Brand } from '../schemas/brand.schema';
import { BrandService } from '../brand.service';
import { BrandStub } from './stubs/brand.stub';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { BadRequestException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';

describe('BrandService', function () {
	let brandService: BrandService;
	let brandModel: Model<Brand>;

	const mockModel = {
		create: jest.fn().mockReturnValue(BrandStub()),
		find: jest.fn(),
		findById: jest.fn(),
		findOneAndDelete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BrandService,
				{
					provide: getModelToken(Brand.name),
					useValue: mockModel,
				},
			],
		}).compile();

		brandService = module.get<BrandService>(BrandService);
		brandModel = module.get<Model<Brand>>(getModelToken(Brand.name));
	});

	it('should be defined', () => {
		expect(brandService).toBeDefined();
	});
	it('reviewModel should be defined', () => {
		expect(brandModel).toBeDefined();
	});

	describe('create', () => {
		it('should create a new brand', async () => {
			const createBrandDto: CreateBrandDto = {
				name: 'THEHINH1',
			};
			const req = { user: { sub: '649a9a4e631a79b49393bd7a' } };

			const result = await brandService.create(createBrandDto, req);

			expect(mockModel.create).toHaveBeenCalledWith(createBrandDto);
			expect(result).toEqual(BrandStub());
		});

		it('should throw an error if the brand creation fails', async () => {
			const req = { user: { sub: '649a8f8ab185ffb672485391' } };
			const createBrandDto: CreateBrandDto = {
				name: 'THEHINH1',
			};

			jest
				.spyOn(mockModel, 'create')
				.mockRejectedValueOnce(new Error('Brand creation failed'));

			expect(brandService.create(createBrandDto, req)).rejects.toThrow(
				new BadRequestException('Brand creation failed'),
			);
		});
	});

	describe('findMany', () => {
		it('should return a list of reviews based on the provided filter', async () => {
			const filter: ListOptions<Brand> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: 0,
			};

			const mockResult = [BrandStub(), BrandStub()];
			jest.spyOn(mockModel, 'find').mockReturnValueOnce({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockResolvedValueOnce(mockResult),
			} as any);

			const result = await brandService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual(mockResult);
			expect(result.total).toBe(mockResult.length);
			expect(result.options).toEqual(filter);
		});

		it('should return an empty list when no review match the filter', async () => {
			const filter: ListOptions<Brand> = {
				sortField: 'createdAt',
				sortOrder: 'asc',
				limit: 10,
				offset: 0,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => ({
				sort: () => ({
					skip: () => ({
						limit: jest.fn().mockResolvedValue([]),
					}),
				}),
			}));

			const result = await brandService.findMany(filter);

			expect(mockModel.find).toHaveBeenCalledWith(filter);
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.options).toEqual(filter);
		});

		it('should handle errors and throw BadRequestException', async () => {
			const filter: ListOptions<Brand> = {
				sortField: 'createdAt',
				sortOrder: 'desc',
				limit: 10,
				offset: -70,
			};

			jest.spyOn(mockModel, 'find').mockImplementation(() => {
				throw new Error('An error occurred while retrieving brands');
			});

			await expect(brandService.findMany(filter)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('findOneByID', () => {
		it('should find a brand by ID', async () => {
			const brandId = '64944c7c2d7cf0ec0dbb4051';

			jest.spyOn(mockModel, 'findById').mockResolvedValue(BrandStub());

			const result = await brandService.findOneByID(brandId);

			expect(result).toEqual(BrandStub());
			expect(mockModel.findById).toHaveBeenCalledWith(brandId);
		});
	});

	describe('delete', () => {
		it('should delete the brand', async () => {
			const brandId = '64944c7c2d7cf0ec0dbb4051';

			jest.spyOn(mockModel, 'findOneAndDelete').mockResolvedValue(BrandStub());

			const result = await brandService.delete(brandId);

			expect(result).toEqual(BrandStub());
			expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
				_id: brandId,
			});
		});

		it('should handle errors during brand deletion', async () => {
			const brandId = '64944c7c2d7cf0ec0dbb4051';

			jest.spyOn(mockModel, 'findOneAndDelete').mockResolvedValue(undefined);

			const result = await brandService.delete(brandId);

			expect(result).toEqual(undefined);
		});
	});
});
