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
		const counter = await this.counterModel.findOne(filter);
		if (!counter) throw new NotFoundException('Counter not found');
		return counter;
	}

	async create(data: object) {
		const input = { ...data, count: 0 };
		return this.counterModel.create(input);
	}

	async increase(id: string) {
		const counter = await this.counterModel.findById(id);
		if (!counter) {
			throw new NotFoundException('Counter not found');
		}
		counter.count += 1;
		await counter.save();
		return counter;
	}

	async decrease(id: string) {
		const counter = await this.counterModel.findById(id);
		if (!counter) {
			throw new NotFoundException('Counter not found');
		}
		counter.count -= 1;
		await counter.save();
		return counter;
	}

	async delete(id: string) {
		const deletedDocument = await this.counterModel.findByIdAndDelete(id);

		if (!deletedDocument) {
			throw new NotFoundException('Document not found');
		}
	}
}
