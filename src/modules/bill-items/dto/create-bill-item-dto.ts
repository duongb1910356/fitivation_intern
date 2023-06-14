import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNotEmptyObject,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import { CreatePromotionDto } from 'src/modules/promotions/dto/create-promotion-dto';
import { CreateBillItemFacilityDto } from './create-bill-item-facility-dto';
import { CreateBillItemPackageTypeDto } from './create-bill-item-package-type-dto';
import { CreateBillItemPackageDto } from './create-bill-item-package-dto';

export class CreateBillItemDto {
	@IsString()
	@IsNotEmpty()
	brandID: string;

	@IsString()
	@IsNotEmpty()
	facilityID: string;

	@IsString()
	@IsNotEmpty()
	packageTypeID: string;

	@IsString()
	@IsNotEmpty()
	packageID: string;

	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => CreateBillItemFacilityDto)
	facilityInfo: CreateBillItemFacilityDto;

	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => CreateBillItemPackageTypeDto)
	packageTypeInfo: CreateBillItemPackageTypeDto;

	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => CreateBillItemPackageDto)
	packageInfo: CreateBillItemPackageDto;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePromotionDto)
	promotions?: CreatePromotionDto[];

	@IsNumber()
	@Min(0)
	promotionPrice: number;

	@IsNumber()
	@Min(0)
	totalPrice: number;
}
