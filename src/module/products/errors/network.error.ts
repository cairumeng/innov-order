import { HttpException, HttpStatus } from '@nestjs/common';

export class NetworkError extends HttpException {
  constructor() {
    super(
      'Network error. Please try it later.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
