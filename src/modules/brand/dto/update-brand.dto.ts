import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBrandDto extends PartialType(
    PickType(CreateBrandDto, []),
){}
