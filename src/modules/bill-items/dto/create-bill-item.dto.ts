import { ApiProperty } from '@nestjs/swagger';
import { BillItemStatus } from '../schemas/bill-item.schema';
import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator';

export class CreateBillItemDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	brandID: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	facilityID: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageTypeID: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageID: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageName: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageType: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	packageDescription: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	brandName: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	ownerFacilityName: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	facilityName: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	facilityAddress: string;

	@ApiProperty()
	@IsArray()
	@ArrayNotEmpty()
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	facilityCoordinatesLocation: [number, number];

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	facilityPhoto: string;

	@ApiProperty()
	@IsOptional()
	promotions?: object[];

	@ApiProperty()
	@IsNumber()
	@IsPositive()
	packagePrice: number;

	@ApiProperty()
	@IsNumber()
	promotionPrice: number;

	@ApiProperty()
	@IsNumber()
	@IsPositive()
	totalPrice: number;

	@ApiProperty()
	@IsEnum(BillItemStatus)
	@IsOptional()
	status?: BillItemStatus;
}
