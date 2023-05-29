import {
	IsMongoId,
	IsNumber,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class CreatePackageTypeDto {
	@IsMongoId()
	facilityID: string;

	@MinLength(2)
	@MaxLength(50)
	name: string;

	@MinLength(6)
	description: string;

	@IsNumber()
	@Min(0)
	price: number;
}
