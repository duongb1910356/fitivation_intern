import { Test, TestingModule } from '@nestjs/testing';
import { CategoryStub } from './stubs/facility-category.stub';
import { FacilityCategoryService } from '../facility-category.service';
import { FacilityCategory } from '../entities/facility-category';
import { getModelToken } from '@nestjs/mongoose';
import { PhotoService } from 'src/modules/photo/photo.service';
import { NotFoundException } from '@nestjs/common';
import { ListOptions } from 'src/shared/response/common-response';
import { CreateCategoryDto } from '../dto/create-category-dto';
import { PhotoStub } from 'src/modules/photo/test/stubs/photo.stub';
import { UpdateCategoryDto } from '../dto/update-category-dto';

jest.mock('../../photo/photo.service');
describe('FacilitySchedule', () => {
	const categoryStub = CategoryStub();
	const photoStub = PhotoStub();
	let photoService: PhotoService;
	let categoryService: FacilityCategoryService;

	const categoryModel = {
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
				FacilityCategoryService,
				PhotoService,
				{
					provide: getModelToken(FacilityCategory.name),
					useValue: categoryModel,
				},
			],
		}).compile();

		categoryService = module.get<FacilityCategoryService>(
			FacilityCategoryService,
		);
		photoService = module.get<PhotoService>(PhotoService);
	});

	it('categoryService should be defined', () => {
		expect(categoryService).toBeDefined();
	});
	it('categoryModel should be defined', () => {
		expect(categoryModel).toBeDefined();
	});
	it('photoService should be defined', () => {
		expect(categoryService).toBeDefined();
	});

	describe('findOneByID', () => {
		it('should throw NotFoundException if schedule not found', async () => {
			const categoryID = categoryStub._id;

			jest.spyOn(categoryModel, 'findById').mockResolvedValue(undefined);

			await expect(categoryService.findOneByID(categoryID)).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should return a schedule if schedule exists', async () => {
			const scheduleID = categoryStub._id;

			jest.spyOn(categoryModel, 'findById').mockResolvedValue(categoryStub);

			const result = await categoryService.findOneByID(scheduleID);

			expect(categoryModel.findById).toHaveBeenCalledWith(scheduleID);

			expect(result).toEqual(categoryStub);
		});
	});

	describe('findMany', () => {
		it('should return schedule array', async () => {
			const filter: ListOptions<FacilityCategory> = {};

			jest.spyOn(categoryModel, 'find').mockImplementation(() => ({
				sort: () => ({
					limit: () => ({
						skip: jest.fn().mockResolvedValue([categoryStub]),
					}),
				}),
			}));

			const result = await categoryService.findMany(filter);

			expect(categoryModel.find).toHaveBeenCalledWith(filter);

			expect(result).toEqual({
				items: [categoryStub],
				total: [categoryStub].length,
				options: filter,
			});
		});
	});

	describe('create', () => {
		it('should create and return a category', async () => {
			const data: CreateCategoryDto = {
				type: 'GYM',
				name: 'GYM',
			};
			const categoryStub = {
				...CategoryStub(),
				save: jest.fn().mockResolvedValue(CategoryStub()),
			};
			const file: Express.Multer.File = {
				fieldname: 'fieldname',
				originalname: 'example.jpg',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 12345,
				buffer: Buffer.from('example image buffer'),
				stream: null,
				destination: 'path/to/destination',
				filename: 'example.jpg',
				path: '/path/to/file.jpg',
			};

			jest.spyOn(categoryModel, 'create').mockResolvedValue(categoryStub);

			jest.spyOn(photoService, 'uploadOneFile').mockResolvedValue(photoStub);

			const result = await categoryService.create(data, file);

			expect(categoryModel.create).toHaveBeenCalledWith(data);

			expect(photoService.uploadOneFile).toHaveBeenCalledWith(
				categoryStub._id,
				file,
			);

			expect(categoryStub.save).toHaveBeenCalledTimes(1);

			expect(result).toEqual(CategoryStub());
		});
	});

	describe('update', () => {
		const categoryID = categoryStub._id;
		const data: UpdateCategoryDto = {
			name: categoryStub.name,
			type: categoryStub.type,
		};

		it('should throw NotFoundException if category not found', async () => {
			jest
				.spyOn(categoryModel, 'findByIdAndUpdate')
				.mockResolvedValue(undefined);

			await expect(categoryService.update(categoryID, data)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should update and return category (without photo file)', async () => {
			jest
				.spyOn(categoryModel, 'findByIdAndUpdate')
				.mockResolvedValue(categoryStub);

			const result = await categoryService.update(categoryID, data);

			expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
				categoryID,
				data,
				{ new: true },
			);

			expect(result).toEqual(categoryStub);
		});
		it('should update and return category (with photo file)', async () => {
			const file: Express.Multer.File = {
				fieldname: 'fieldname',
				originalname: 'example.jpg',
				encoding: '7bit',
				mimetype: 'image/jpeg',
				size: 12345,
				buffer: Buffer.from('example image buffer'),
				stream: null,
				destination: 'path/to/destination',
				filename: 'example.jpg',
				path: '/path/to/file.jpg',
			};
			const categoryStub = {
				...CategoryStub(),
				save: jest.fn().mockResolvedValue(CategoryStub()),
			};

			jest
				.spyOn(categoryModel, 'findByIdAndUpdate')
				.mockResolvedValue(categoryStub);

			jest.spyOn(photoService, 'delete').mockResolvedValue(true);

			jest.spyOn(photoService, 'uploadOneFile').mockResolvedValue(photoStub);

			const result = await categoryService.update(categoryID, data, file);

			expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
				categoryID,
				data,
				{ new: true },
			);

			expect(photoService.delete).toHaveBeenCalledWith(categoryStub.photo._id);

			expect(photoService.uploadOneFile).toHaveBeenCalledWith(categoryID, file);

			expect(categoryStub.save).toHaveBeenCalledTimes(1);

			expect(result).toEqual(categoryStub);
		});
	});

	describe('delete', () => {
		const categotyID = categoryStub._id;
		it('should throw NotFoundException if category not found', async () => {
			jest
				.spyOn(categoryModel, 'findByIdAndUpdate')
				.mockResolvedValue(undefined);

			await expect(categoryService.delete(categotyID)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should delete category', async () => {
			jest
				.spyOn(categoryModel, 'findByIdAndDelete')
				.mockResolvedValue(categoryStub);

			jest.spyOn(photoService, 'delete').mockResolvedValue(true);

			await categoryService.delete(categotyID);

			expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(categotyID);

			expect(photoService.delete).toHaveBeenCalledWith(categoryStub.photo._id);
		});
	});
});
