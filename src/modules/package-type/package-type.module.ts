import { Module } from '@nestjs/common';
import { PackageTypeController } from './package-type.controller';
import { PackageTypeService } from './package-type.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageType, PackageTypeSchema } from './entities/package-type.entity';
import { CounterModule } from '../counter/counter.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: PackageType.name, schema: PackageTypeSchema },
		]),
		CounterModule,
	],
	controllers: [PackageTypeController],
	providers: [PackageTypeService],
	exports: [PackageTypeService],
})
export class PackageTypeModule {}
