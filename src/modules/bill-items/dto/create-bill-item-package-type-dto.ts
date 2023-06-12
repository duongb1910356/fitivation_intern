import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateBillItemPackageTypeDto {
	@IsString()
	@IsNotEmpty()
	facilityID: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber()
	@Min(0)
	price: number;

	@IsNumber()
	@IsOptional()
	order?: number;
}
