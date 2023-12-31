import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter, CounterDocument } from './entities/counter.entity';
import { Model } from 'mongoose';

@Injectable()
export class CounterService {
	constructor(
		@InjectModel(Counter.name)
		private counterModel: Model<CounterDocument>,
	) {}

	async findOneByCondition(filter: Partial<Counter>): Promise<Counter> {
		return await this.counterModel.findOne(filter);
	}

	async create(data: object): Promise<Counter> {
		const input = { ...data, count: 0 };
		return this.counterModel.create(input);
	}

	async increase(id: string): Promise<Counter> {
		const counter = await this.counterModel.findById(id);
		if (!counter) {
			throw new NotFoundException('Counter not found');
		}
		counter.count += 1;
		await counter.save();
		return counter;
	}

	async decrease(id: string): Promise<Counter> {
		const counter = await this.counterModel.findById(id);
		if (!counter) {
			throw new NotFoundException('Counter not found');
		}
		counter.count -= 1;
		await counter.save();
		return counter;
	}

	async delete(id: string): Promise<void> {
		const counter = await this.counterModel.findByIdAndDelete(id);

		if (!counter) {
			throw new NotFoundException('Counter not found');
		}
	}
}
