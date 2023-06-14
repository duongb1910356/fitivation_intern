import { IsNotEmpty, IsArray, IsString, IsOptional } from 'class-validator';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';

export class UpdatePhotoOfFacilityDto {
	@IsNotEmpty()
	@IsArray()
	photos: FileUploadDto[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	deletedImages?: string[];
}
