import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class FileUploadDto {
	// @IsString()
	// describe?: string;

	@ApiProperty({ type: 'string', format: 'binary' })
	file: Express.Multer.File;
}
