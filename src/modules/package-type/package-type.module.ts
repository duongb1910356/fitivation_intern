import { Module } from '@nestjs/common';
import { PackageTypeController } from './package-type.controller';
import { PackageTypeService } from './package-type.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageType, PackageTypeSchema } from './entities/package-type.entity';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: PackageType.name, schema: PackageTypeSchema },
		]),
	],
	controllers: [PackageTypeController],
	providers: [PackageTypeService],
})
export class PackageTypeModule {}
