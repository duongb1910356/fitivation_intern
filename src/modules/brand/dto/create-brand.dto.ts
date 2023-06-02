import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({ example: 'Example Name' })
    @IsString()
    name: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    photo: any;
}
