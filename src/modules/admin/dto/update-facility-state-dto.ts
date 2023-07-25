import { IsEnum, IsNotEmpty } from 'class-validator';
import { State } from 'src/modules/facility/schemas/facility.schema';

export class UpdateFacilityStateDto {
	@IsNotEmpty()
	@IsEnum(State)
	state: State;
}
