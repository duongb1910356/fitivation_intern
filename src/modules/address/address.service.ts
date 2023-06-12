import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { DefaultListDto } from '../../shared/dto/default-list-dto';
import { ESortOrder } from '../../shared/enum/sort.enum';
import { SuccessResponse } from '../../shared/response/success-response';
import { Password } from '../../utils/password';
import { RegisterDto } from '../auth/dto/register-dto';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { District, DistrictDocument } from './schemas/district.schema';
import { ListResponse } from 'src/shared/response/common-response';
import { Commune, CommuneDocument } from './schemas/commune.schema';
@Injectable()
export class AddressService {
    constructor(
        @InjectModel(Province.name) private provinceModel: Model<ProvinceDocument>,
        @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
        @InjectModel(Commune.name) private communeModel: Model<CommuneDocument>
    ) { }

    async findProvinceAll(): Promise<ListResponse<Province>> {
        try {

            const provinces = await this.provinceModel.find();

            return {
                items: provinces,
                total: provinces.length,
                options: {}
            };
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async findDistrictsByProvinceID(id: String): Promise<ListResponse<District>> {
        try {

            const districts = await this.districtModel.find({province: id});
            // console.log("districts >>> ", districts);
            if(districts.length === 0){
                throw new NotFoundException('Districts of province not found!');
            }
            return {
                items: districts,
                total: districts.length,
                options: {}
            };
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    async findCommunesByDistrictID(id: String): Promise<ListResponse<Commune>> {
        try {

            const communes = await this.communeModel.find({district: id});
            if(communes.length === 0){
                throw new NotFoundException('Commune of district not found!');
            }
            return {
                items: communes,
                total: communes.length,
                options: {}
            };
        } catch (err) {
            throw new BadRequestException(err);
        }
    }
}
