import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsArray,
	IsOptional,
} from 'class-validator';

export class PurchaseDto {
	@IsArray()
	@ArrayMinSize(1)
	@ArrayNotEmpty()
	CartItemIDs: string[];

	@IsArray()
	@IsOptional()
	promotionIDs?: string[];
}
