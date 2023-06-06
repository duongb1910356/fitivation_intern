import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateCartDto {
	@IsString()
	@IsNotEmpty()
	accountID: string;

	@IsOptional()
	@IsArray()
	promotionsIDs?: object[];

	@IsNumber()
	@IsOptional()
	@Min(0)
	promotionPrice?: number;

	@IsNumber()
	@IsOptional()
	totalPrice?: number;
}
