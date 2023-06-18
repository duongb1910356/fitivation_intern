import {
	IsNotEmpty,
	IsArray,
	IsString,
	IsOptional,
	ArrayMaxSize,
} from 'class-validator';

export class CreateReviewDto {
	@IsOptional()
	accountID?: string;

	@IsNotEmpty()
	@IsString()
	facilityID: string;

	@IsNotEmpty()
	rating: string;

	@IsString()
	@IsOptional()
	comment: string;

	// @IsArray()
	// @IsOptional()
	// @ArrayMaxSize(5)
	// photos: FileUploadDto[];

	// @IsArray()
	// @IsOptional()
	// @ArrayMaxSize(5)
	// photos?: object;
}
