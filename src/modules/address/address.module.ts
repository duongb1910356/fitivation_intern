import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema, District, DistrictSchema, Commune, CommuneSchema } from './schemas/address.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Province.name, schema: ProvinceSchema }]),
        MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]),
        MongooseModule.forFeature([{ name: Commune.name, schema: CommuneSchema }]),
    ],
    providers: [],
    exports: [],
    controllers: [],
})

export class AddressModule {}
