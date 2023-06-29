import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from './entities/package.entity';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
		PromotionsModule,
	],
	controllers: [PackageController],
	providers: [PackageService],
	exports: [PackageService],
})
export class PackageModule {}
