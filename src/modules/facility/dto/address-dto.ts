import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class AddressDto {
    @IsObject()
    district: DistrictDto;

    @IsObject()
    commune: CommuneDto;
}

export class DistrictDto {
    @IsString()
    name: string;

    @IsNumber()
    code: number;
}

export class CommuneDto {
    @IsString()
    name: string;

    @IsNumber()
    code: number;
}