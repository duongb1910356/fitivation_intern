import { IsEnum, IsNumber } from 'class-validator';
import { TimeType } from 'src/modules/package/entities/package.entity';

export class CreateBillItemPackageDto {
	@IsEnum(TimeType)
	type: TimeType;

	@IsNumber()
	price: number;
}
