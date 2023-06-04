import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';
import { Counter } from './entities/counter.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Counter.name, schema: Counter }]),
	],
	providers: [CounterService],
	controllers: [CounterController],
})
export class CounterModule {}
