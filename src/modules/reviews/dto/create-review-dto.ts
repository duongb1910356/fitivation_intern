import {
	IsNotEmpty,
	IsNumber,
	IsArray,
	IsString,
	IsOptional,
	ArrayMaxSize,
} from 'class-validator';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';

export class CreateReviewDto {
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
	photos: FileUploadDto[];
}
