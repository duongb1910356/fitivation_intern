import {
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	Min,
} from 'class-validator';
import { TimeType } from '../entities/package.entity';

export class CreatePackageDto {
	@IsNotEmpty()
	@IsEnum(TimeType)
	type: TimeType;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price: number;

	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(1)
	benefits: string[];
}
