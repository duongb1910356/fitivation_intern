import { DefaultListDto } from 'src/shared/dto/default-list-dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class GetPackageTypeDto extends PartialType(
	PickType(DefaultListDto, ['limit', 'offset']),
) {}
