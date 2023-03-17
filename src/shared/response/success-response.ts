import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ type: Number, example: 200 })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Delete success!' })
  message: string;

  @ApiProperty()
  data?: T | null;
}
