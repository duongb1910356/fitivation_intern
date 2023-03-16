import { ApiProperty } from '@nestjs/swagger';

export class DefaultListDto {
  @ApiProperty({ required: false })
  limit?: number;

  @ApiProperty({ required: false })
  offset?: number;

  @ApiProperty({ required: false })
  searchValue?: string;

  @ApiProperty({ required: false })
  searchField?: string;

  @ApiProperty({ required: false })
  sortField?: string;

  @ApiProperty({ required: false })
  sortOrder?: 'asc' | 'desc';
}
