import { ApiProperty } from '@nestjs/swagger';

// export class ReviewDto {
// 	@IsEmail()
// 	@ApiProperty({ description: 'User email', example: 'test1@test.com' })
// 	email: string;

// 	@MinLength(6)
// 	@ApiProperty({ description: 'User password', example: '123123123' })
// 	password: string;
// }

import { IsNotEmpty, IsNumber, Min, Max, IsArray, IsString, ArrayNotEmpty, Validate, IsObject, IsOptional, IsEnum, isEnum } from 'class-validator';
import { isURL } from 'class-validator';
import { State, Status, ScheduleType  } from '../../../shared/enum/facility.enum';
import { isObjectIdOrHexString } from 'mongoose';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';

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

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: number;

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

