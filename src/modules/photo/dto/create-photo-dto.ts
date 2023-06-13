import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Express } from 'express';

export class CreatePhotoDto {

    //   @IsString()
    //   describe?: string;

    //   @ApiProperty({ type: 'string', format: 'binary' })
    //   @IsNotEmpty()
    //   file: Express.Multer.File;

    @IsString()
    @IsNotEmpty()
    ownerID: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    describe: string;

}
