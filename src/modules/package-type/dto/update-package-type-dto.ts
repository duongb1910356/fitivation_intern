import {
	IsOptional,
	MinLength,
	MaxLength,
	IsNumber,
	Min,
} from 'class-validator';

export class UpdatePackageTypeDto {
	@IsOptional()
	@MinLength(2)
	@MaxLength(50)
	name?: string;

	@IsOptional()
	@MinLength(6)
	description?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	price?: number;
}
