import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { TimeType } from '../entities/package.entity';

export class CreatePackageDto {
	@IsNotEmpty()
	@IsEnum(TimeType)
	type: TimeType;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price: number;
}
