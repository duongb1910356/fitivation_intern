import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCartItemDto {
	@IsString()
	@IsNotEmpty()
	packageID: string;

	@IsOptional()
	@IsArray()
	promotionIDs: string[];
}
