import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Counter } from 'src/modules/counter/entities/counter.entity';
import { counterData } from './data/counter-data';
@Injectable()
export class CounterSeeder implements Seeder {
	constructor(
		@InjectModel(Counter.name)
		private readonly counterModel: Model<Counter>,
	) {}

	async seed(): Promise<any> {
		await this.counterModel.insertMany(counterData);
	}

	async drop(): Promise<any> {
		await this.counterModel.deleteMany({});
	}
}
