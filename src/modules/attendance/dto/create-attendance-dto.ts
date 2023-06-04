import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
	@IsNotEmpty()
	@IsMongoId()
	accountID: string;

	@IsNotEmpty()
	@IsMongoId()
	facilityID: string;
}
