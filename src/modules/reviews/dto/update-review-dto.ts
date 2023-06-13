import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateReviewDto } from './create-review-dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateReviewDto extends PartialType(
	OmitType(CreateReviewDto, ['facilityID']),
) {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	deletedImages?: string[];
}
