import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Holiday } from './entities/holiday.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Holiday.name, schema: Holiday }]),
	],
	controllers: [HolidayController],
	providers: [HolidayService],
})
export class HolidayModule {}
