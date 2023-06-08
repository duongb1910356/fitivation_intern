import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, Min, Max, IsArray, IsString, ArrayNotEmpty, Validate, IsObject, IsOptional, IsEnum, isEnum } from 'class-validator';
import { isURL } from 'class-validator';
import { State, Status, ScheduleType  } from '../../../shared/enum/facility.enum';
import { isObjectIdOrHexString } from 'mongoose';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';

export class CreateFacilityDto {
    @IsNotEmpty()
    @IsString()
    brandID: string;

    @IsNotEmpty()
    @IsString()
    facilityCategoryID: string;

    // @IsNotEmpty()
    // @IsString()
    // ownerID?: string;

    @IsEnum(State)
    @IsOptional()
    state?: State;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    address: CreateAddressDto;

    @IsString()
    @IsOptional()
    summary: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @IsNumber({}, { each: true })
    coordinatesLocation?: number[];

    @IsEnum(ScheduleType)
    scheduleType: ScheduleType

    @IsNotEmpty()
    @IsArray()
    photos: FileUploadDto[]

}

