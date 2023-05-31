import { PartialType, PickType } from '@nestjs/swagger';
import { DefaultListDto } from 'src/shared/dto/default-list-dto';

export class GetPackageDto extends PartialType(
	PickType(DefaultListDto, ['sortField', 'sortOrder']),
) {}
