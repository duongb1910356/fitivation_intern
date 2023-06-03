import { ApiProperty } from '@nestjs/swagger';

// export class ReviewDto {
// 	@IsEmail()
// 	@ApiProperty({ description: 'User email', example: 'test1@test.com' })
// 	email: string;

// 	@MinLength(6)
// 	@ApiProperty({ description: 'User password', example: '123123123' })
// 	password: string;
// }

import { IsNotEmpty, IsNumber, Min, Max, IsArray, IsString, ArrayNotEmpty, Validate, IsObject, IsOptional, IsEnum, isEnum, ArrayMaxSize } from 'class-validator';
import { isURL } from 'class-validator';
import { State, Status, ScheduleType  } from '../../../shared/enum/facility.enum';
import { isObjectIdOrHexString } from 'mongoose';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';

export class CreateReviewDto {
    
    @IsOptional()
    accountID?: string;

    @IsNotEmpty()
    @IsString()
    facilityID: string;

    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsString()
    @IsOptional()
    comment: string;

    @IsArray()
    @IsOptional()
    @ArrayMaxSize(5)
    photos: FileUploadDto[]

}

