import {
	ArrayMinSize,
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class UpdatePackageDto {
	@IsOptional()
	@IsNumber()
	@Min(0)
	price?: number;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(1)
	benefits?: string[];
}
