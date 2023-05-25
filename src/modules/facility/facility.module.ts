import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './schemas/facility.schema';
import { Brand, BrandSchema } from './schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Facility.name, schema: FacilitySchema }]),
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [],
  providers: []
})
export class FacilityModule { }
