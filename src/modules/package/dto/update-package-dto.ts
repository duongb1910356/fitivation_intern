import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePackageDto } from './create-package-dto';

export class UpdatePackageDto extends PartialType(
	PickType(CreatePackageDto, ['price']),
) {}
