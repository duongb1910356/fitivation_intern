import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePackageTypeDto } from './create-package-type-dto';

export class UpdatePackageType extends PartialType(
	PickType(CreatePackageTypeDto, ['name', 'description', 'price']),
) {}
