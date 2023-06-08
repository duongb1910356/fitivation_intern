import { Injectable } from '@nestjs/common';
import { ProvinceService } from '../province.service';
import { level1s } from 'dvhcvn'
import { ProvinceDto } from '../dto/province-dto';

@Injectable()
export class DataImporter {
    constructor(private readonly provinceService: ProvinceService) { }

    async importData(): Promise<void> {
        try {
            // Import dữ liệu vào MongoDB sử dụng ProvinceService
            const createProvinceDto: ProvinceDto = {
                name: level1s[0].name,
                code: level1s[0].id
            };
            await this.provinceService.createMany(createProvinceDto);
            console.log('Import dữ liệu thành công!');
        } catch (error) {
            console.error('Lỗi khi import dữ liệu:', error);
        }
    }
}
