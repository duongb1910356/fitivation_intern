import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class CreatePackageTypeDto {
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(50)
	name: string;

	@IsNotEmpty()
	@MinLength(6)
	description: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price: number;
}
