import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Holiday, HolidaySchema } from './entities/holiday.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Holiday.name, schema: HolidaySchema }]),
	],
	controllers: [HolidayController],
	providers: [HolidayService],
	exports: [HolidayService],
})
export class HolidayModule {}
