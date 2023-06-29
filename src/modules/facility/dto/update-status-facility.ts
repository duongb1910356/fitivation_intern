import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../schemas/facility.schema';

export class UpdateStatusFacilityDto {
	@IsNotEmpty()
	@IsEnum(Status)
	status: Status;
}
