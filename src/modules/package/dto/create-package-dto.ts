import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';
import { TimeType } from '../entities/package.entity';

export class CreatePackageDto {
	@IsMongoId()
	packageTypeID: string;

	@IsMongoId()
	facilityID: string;

	@IsString()
	type: TimeType;

	@IsNumber()
	@Min(0)
	price: number;
}
