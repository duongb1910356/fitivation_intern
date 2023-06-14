import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter, CounterDocument } from './entities/counter.entity';
import { Model } from 'mongoose';

@Injectable()
export class CounterService {
	constructor(
		@InjectModel(Counter.name)
		private counterModel: Model<CounterDocument>,
	) {}

	async findOne(filter: Partial<Counter>): Promise<Counter> {
		return this.counterModel.findOne(filter);
	}

	async create(data: object) {
		console.log('create');
		const input = { ...data, count: 0 };
		return this.counterModel.create(input);
	}

	async increase(id: string, oldCount: number) {
		console.log('increase');
		const count = { count: oldCount + 1 };
		return await this.counterModel.findByIdAndUpdate(id, count, {
			new: true,
		});
	}

	async decrease(id: string, oldCount: number) {
		console.log('decrease');
		const count = { count: oldCount - 1 };
		return await this.counterModel.findByIdAndUpdate(id, count, {
			new: true,
		});
	}
}
