import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';
import { State } from '../schemas/facility.schema';
import { LocationDTO } from './create-facility-dto';

export class UpdateFacilityDto {
	@IsOptional()
	@IsString()
	brandID: string;

	@IsOptional()
	@IsString()
	facilityCategoryID: string;

	@IsOptional()
	@IsOptional()
	ownerID?: string;

	@IsEnum(State)
	@IsOptional()
	state?: State;

	@IsOptional()
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

	// @IsArray()
	// @IsOptional()
	// coordinates?: number[];

	@IsOptional()
	location: LocationDTO;

	@IsOptional()
	schedule: string;
}
