import { Module } from '@nestjs/common';
import { PackageTypeController } from './package-type.controller';
import { PackageTypeService } from './package-type.service';

@Module({
	controllers: [PackageTypeController],
	providers: [PackageTypeService],
})
export class PackageTypeModule {}
