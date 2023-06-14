import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(
	PickType(CreateBrandDto, ['name']),
) {}
