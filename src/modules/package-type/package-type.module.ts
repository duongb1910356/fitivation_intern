import { Module } from '@nestjs/common';
import { PackageTypeController } from './package-type.controller';

@Module({
	controllers: [PackageTypeController],
})
export class PackageTypeModule {}
