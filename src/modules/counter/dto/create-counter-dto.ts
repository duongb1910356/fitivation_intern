import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { CountObject, TargetObject } from '../entities/counter.entity';

export class CreateCounterDto {
	@IsNotEmpty()
	@IsEnum(TargetObject)
	targetObject: TargetObject;

	@IsNotEmpty()
	@IsMongoId()
	targetID: string;

	@IsNotEmpty()
	@IsEnum(CountObject)
	countObject: CountObject;
}
