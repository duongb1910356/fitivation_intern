import {
	IsNotEmpty,
	IsArray,
	IsString,
	IsOptional,
	IsEnum,
} from 'class-validator';
import { State, ScheduleType } from '../../../shared/enum/facility.enum';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';
import { Photo } from 'src/modules/photo/schemas/photo.schema';

export class CreateFacilityDto {
	@IsNotEmpty()
	@IsString()
	brandID: string;

	@IsNotEmpty()
	@IsString()
	facilityCategoryID: string;

	@IsOptional()
	@IsString()
	ownerID: string;

	@IsEnum(State)
	@IsOptional()
	state?: State;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	address: CreateAddressDto;

	@IsString()
	@IsOptional()
	summary: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsArray()
	coordinates?: number[];

	@IsEnum(ScheduleType)
	scheduleType: ScheduleType;

	@IsArray()
	@IsOptional()
	photos: Photo[];
}
