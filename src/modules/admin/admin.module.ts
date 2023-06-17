import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PackageTypeModule } from '../package-type/package-type.module';
import { PackageModule } from '../package/package.module';
import { FacilityCategoryModule } from '../facility-category/facility-category.module';

@Module({
	imports: [PackageTypeModule, PackageModule, FacilityCategoryModule],
	controllers: [AdminController],
})
export class AdminModule {}
