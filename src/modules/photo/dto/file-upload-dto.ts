import { IsNotEmpty, IsString } from 'class-validator';
import { Express } from 'express';

export class FileUploadDto {
	@IsString()
	describe?: string;

	// @ApiProperty({ type: 'string', format: 'binary' })
	@IsNotEmpty()
	file?: Express.Multer.File;
}
