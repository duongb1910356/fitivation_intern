import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';
import { State, ScheduleType } from '../schemas/facility.schema';

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

	@IsArray()
	@IsOptional()
	coordinates?: number[];

	@IsEnum(ScheduleType)
	@IsOptional()
	scheduleType: ScheduleType;
}
