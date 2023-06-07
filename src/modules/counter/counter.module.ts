import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { Counter, CounterSchema } from './entities/counter.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
	],
	providers: [CounterService],
})
export class CounterModule {}
