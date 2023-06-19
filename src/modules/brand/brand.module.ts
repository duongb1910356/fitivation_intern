import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { BrandRepository } from 'src/modules/brand/repositories/brand.repository';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
	],
	providers: [
		BrandService,
		{ provide: 'BrandRepository', useClass: BrandRepository },
	],
	exports: [BrandService],
	controllers: [BrandController],
})
export class BrandModule {}
