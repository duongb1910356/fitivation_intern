import {
	IsNotEmpty,
	IsNumber,
	IsArray,
	IsString,
	IsOptional,
	IsEnum,
} from 'class-validator';
import { State, ScheduleType } from '../../../shared/enum/facility.enum';
import { FileUploadDto } from 'src/modules/photo/dto/file-upload-dto';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';

export class CreateFacilityDto {
	@IsNotEmpty()
	@IsString()
	brandID: string;

	@IsNotEmpty()
	@IsString()
	facilityCategoryID: string;

	// @IsNotEmpty()
	// @IsString()
	// ownerID?: string;

	@IsEnum(State)
	@IsOptional()
	state?: State;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	address: CreateAddressDto;

	@IsString()
	@IsOptional()
	summary: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsArray()
	@IsNumber({}, { each: true })
	coordinatesLocation?: number[];

	@IsEnum(ScheduleType)
	scheduleType: ScheduleType;

	@IsNotEmpty()
	@IsArray()
	photos: FileUploadDto[];
}
