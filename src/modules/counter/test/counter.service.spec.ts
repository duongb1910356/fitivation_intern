import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CounterService } from '../counter.service';
import { CountObject, Counter, TargetObject } from '../entities/counter.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CounterStub } from './stubs/counter.stub';
import { NotFoundException } from '@nestjs/common';

describe('CounterService', () => {
	const counterStub = CounterStub();
	let counterModel: Model<Counter>;
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
		updateOne: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(Counter.name),
					useValue: mockModel,
				},
				CounterService,
			],
		}).compile();

		counterService = module.get<CounterService>(CounterService);
		counterModel = module.get<Model<Counter>>(getModelToken(Counter.name));
	});

	it('counterService should be defined', () => {
		expect(counterService).toBeDefined();
	});
	it('counterModel should be defined', () => {
		expect(counterModel).toBeDefined();
	});

	describe('findOneByCondition', () => {
		it('should return a counter', async () => {
			const filter: Partial<Counter> = {};

			jest.spyOn(mockModel, 'findOne').mockResolvedValue(counterStub);

			const result = await counterService.findOneByCondition(filter);

			expect(mockModel.findOne).toHaveBeenCalledWith(filter);

			expect(result).toEqual(counterStub);
		});
	});

	describe('create', () => {
		it('should create and return a counter', async () => {
			const data: object = {
				targetObject: TargetObject.FACILITY,
				targetID: '64931e19d380fac3cd02a6a0',
				countObject: CountObject.PACKAGE_TYPE,
			};
			jest.spyOn(mockModel, 'create').mockResolvedValue(counterStub);

			const result = await counterService.create(data);

			expect(mockModel.create).toHaveBeenCalledWith({ ...data, count: 0 });

			expect(result).toEqual(counterStub);
		});
	});

	describe('increase', () => {
		it('should throw NotFoundException if counter not found', async () => {
			jest.spyOn(mockModel, 'findById').mockResolvedValue(undefined);

			expect(counterService.increase(counterStub._id)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should increase and return counter', async () => {
			const counterStub = {
				_id: '6493cd02a6a031e19d380fac',
				targetObject: TargetObject.FACILITY,
				targetID: '64931e19d380fac3cd02a6a0',
				countObject: CountObject.PACKAGE_TYPE,
				count: 2,
				save: jest.fn(),
			};
			jest.spyOn(mockModel, 'findById').mockResolvedValue(counterStub);

			const result = await counterService.increase(counterStub._id);

			expect(mockModel.findById).toHaveBeenCalledWith(counterStub._id);

			expect(counterStub.save).toHaveBeenCalledTimes(1);

			expect(result.count).toBe(3);
		});
	});

	describe('decrease', () => {
		it('should throw NotFoundException if counter not found', async () => {
			jest.spyOn(mockModel, 'findById').mockResolvedValue(undefined);

			expect(counterService.decrease(counterStub._id)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should decrease and return counter', async () => {
			const counterStub = {
				_id: '6493cd02a6a031e19d380fac',
				targetObject: TargetObject.FACILITY,
				targetID: '64931e19d380fac3cd02a6a0',
				countObject: CountObject.PACKAGE_TYPE,
				count: 2,
				save: jest.fn(),
			};
			jest.spyOn(mockModel, 'findById').mockResolvedValue(counterStub);

			const result = await counterService.decrease(counterStub._id);

			expect(mockModel.findById).toHaveBeenCalledWith(counterStub._id);

			expect(counterStub.save).toHaveBeenCalledTimes(1);

			expect(result.count).toBe(1);
		});
	});

	describe('delete', () => {
		it('should throw NotFoundException if counter not found', async () => {
			jest.spyOn(mockModel, 'findByIdAndDelete').mockResolvedValue(undefined);

			expect(counterService.delete(counterStub._id)).rejects.toThrow(
				NotFoundException,
			);
		});
		it('should delete a counter', async () => {
			jest.spyOn(mockModel, 'findByIdAndDelete').mockResolvedValue(counterStub);

			await counterService.delete(counterStub._id);

			expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(counterStub._id);
		});
	});
});
