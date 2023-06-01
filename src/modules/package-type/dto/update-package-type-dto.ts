import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePackageTypeDto } from './create-package-type-dto';

export class UpdatePackageTypeDto extends PartialType(
	PickType(CreatePackageTypeDto, ['name', 'description', 'price']),
) {}
