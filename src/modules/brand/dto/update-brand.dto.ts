import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
    @ApiProperty({ example: 'Example Name' })
    @IsString()
    name?: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    photo?: any;

    @ApiProperty({ example: 'Example accountID' })
    @IsString()
    accountID?: string
}
