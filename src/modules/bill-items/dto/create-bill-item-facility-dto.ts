import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';

export class CreateBillItemFacilityDto {
	@IsString()
	@IsNotEmpty()
	brandName: string;

	@IsString()
	@IsNotEmpty()
	ownerFacilityName: string;

	@IsString()
	@IsNotEmpty()
	facilityName: string;

	@IsObject()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => CreateAddressDto)
	facilityAddress: CreateAddressDto;

	@IsArray()
	@IsOptional()
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	facilityCoordinatesLocation?: number[];

	@IsObject()
	@IsOptional()
	facilityPhoto?: string;
}
