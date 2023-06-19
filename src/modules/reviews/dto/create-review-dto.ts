import {
	IsNotEmpty,
	IsArray,
	IsString,
	IsOptional,
	ArrayMaxSize,
} from 'class-validator';
import { Photo } from 'src/modules/photo/schemas/photo.schema';

export class CreateReviewDto {
	@IsOptional()
	accountID?: string;

	@IsNotEmpty()
	@IsString()
	facilityID: string;

	@IsNotEmpty()
	rating: number;

	@IsString()
	@IsOptional()
	comment: string;

	@IsArray()
	@IsOptional()
	@ArrayMaxSize(5)
	photos?: Photo[];
}
