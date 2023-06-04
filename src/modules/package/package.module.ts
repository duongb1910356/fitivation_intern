import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Package } from './entities/package.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Package.name, schema: Package }]),
	],
	controllers: [PackageController],
	providers: [PackageService],
})
export class PackageModule {}
