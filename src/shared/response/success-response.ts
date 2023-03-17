import { HttpStatus } from '@nestjs/common';

export class SuccessResponse<T> {
  statusCode: HttpStatus;
  message: string;
  data?: T | null;
}
