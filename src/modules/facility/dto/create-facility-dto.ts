import {
	IsNotEmpty,
	IsArray,
	IsString,
	IsOptional,
	IsEnum,
	IsNumber,
	ArrayMinSize,
	ArrayMaxSize,
} from 'class-validator';
import { State, ScheduleType } from '../../../shared/enum/facility.enum';
import { CreateAddressDto } from 'src/modules/address/dto/create-address-dto';
import { Photo } from 'src/modules/photo/schemas/photo.schema';
import { FacilityScheduleDto } from 'src/modules/facility-schedule/dto/facility-schedule-dto';

export class LocationDTO {
	@IsArray()
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	@IsNumber({}, { each: true })
	coordinates: [number, number];

	@IsString()
	@IsOptional()
	type?: string = 'Point';
}

// export class ScheduleObject {
// 	@IsString()
// 	@IsNotEmpty()
// 	facilityID: string;

// 	@IsEnum(ScheduleType)
// 	type: 'DAILY';

// 	@ArrayNotEmpty()
// 	@ValidateNested({ each: true })
// 	@Type(() => OpenTimeDto)
// 	@ValidateScheduleType()
// 	openTime: OpenTimeDto[];
// }

export class CreateFacilityDto {
	@IsNotEmpty()
	@IsString()
	brandID: string;

	@IsNotEmpty()
	@IsArray()
	facilityCategoryID: string[];

	@IsString()
	@IsOptional()
	ownerID: string;

	@IsEnum(State)
	@IsOptional()
	state?: State;

	@IsNotEmpty()
	location: LocationDTO;

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

	// @IsArray()
	// coordinates?: number[];

	@IsEnum(ScheduleType)
	scheduleType: ScheduleType;

	@IsArray()
	@IsOptional()
	photos: Photo[];

	@IsString()
	phone: string;

	@IsOptional()
	schedule: FacilityScheduleDto;
}
