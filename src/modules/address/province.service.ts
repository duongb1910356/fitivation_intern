import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Province } from './schemas/province.schema';
import { District } from './schemas/district.schema';
import { Commune } from './schemas/commune.schema';
import { ProvinceDto } from './dto/province-dto';

@Injectable()
export class ProvinceService {
    constructor(
        @InjectModel(Province.name) private provinceModel: Model<Province>,
    ) { }

    async createMany(input: ProvinceDto): Promise<Province> {
        try {
            const createdProvince = new this.provinceModel(input);
            return await createdProvince.save();
        } catch (error) {
            console.log('Error import province ', error)
            return error;
        }
    }

}
