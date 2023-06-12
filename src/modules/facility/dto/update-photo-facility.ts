import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, Min, Max, IsArray, IsString, ArrayNotEmpty, Validate, IsObject, IsOptional, IsEnum, isEnum } from 'class-validator';
import { isURL } from 'class-validator';
import { State, Status, ScheduleType  } from '../../../shared/enum/facility.enum';
import { isObjectIdOrHexString } from 'mongoose';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';

export class UpdatePhotoOfFacilityDto {
   
    @IsNotEmpty()
    @IsArray()
    photos: FileUploadDto[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    deletedImages?: string[];

}

