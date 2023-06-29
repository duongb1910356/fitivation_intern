import { IsArray, IsString, IsOptional } from 'class-validator';

export class DeleteReviewOfFacilityDto {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	listDeleteID?: string[];
}
