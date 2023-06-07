import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from './entities/package.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
	],
	controllers: [PackageController],
	providers: [PackageService],
})
export class PackageModule {}
