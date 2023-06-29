import { IsArray, IsString, IsOptional } from 'class-validator';

export class DeletePhotoOfFacilityDto {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	listDeleteID?: string[];
}
