import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T, F = null> {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Delete success!' })
  message?: string;

  @ApiProperty({ type: Number, description: 'Total data in a list resp' })
  total?: number;

  @ApiProperty({ type: Number, description: 'The filter apply' })
  filter?: F;

  @ApiProperty()
  data?: T;
}
