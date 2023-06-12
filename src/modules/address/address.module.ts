import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema} from './schemas/province.schema';
import { District, DistrictSchema } from './schemas/district.schema';
import { Commune, CommuneSchema } from './schemas/commune.schema';
import { AddressController } from './address.controller';
import { DataImporter } from './import-script/import-data';
import { ProvinceService } from './province.service';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Province.name, schema: ProvinceSchema }]),
        MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]),
        MongooseModule.forFeature([{ name: Commune.name, schema: CommuneSchema }]),
    ],
    providers: [DataImporter, ProvinceService],
    exports: [DataImporter, ProvinceService],
    controllers: [AddressController],
})

export class AddressModule {}
