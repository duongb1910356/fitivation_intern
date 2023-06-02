import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Express } from 'express';

export class FileUploadDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fileName?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: Express.Multer.File;
}
