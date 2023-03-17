import { ApiProperty } from '@nestjs/swagger';

export class DefaultListDto {
  @ApiProperty({
    required: false,
    description: 'Number of items limited',
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    required: false,
    description: 'Number of items skipped',
    default: 0,
  })
  offset?: number;

  @ApiProperty({
    required: false,
    description: 'Search value for the expected result',
    example: 'search@gmail.com',
  })
  searchValue?: string;

  @ApiProperty({
    required: false,
    description: 'The name of field searched',
    example: 'email',
  })
  searchField?: string;

  @ApiProperty({
    required: false,
    description: 'The name of sort field sorted',
    example: 'createdAt',
  })
  sortField?: string;

  @ApiProperty({
    required: false,
    description: 'Sort newest or oldest',
    example: 'asc',
  })
  sortOrder?: 'asc' | 'desc';
}
