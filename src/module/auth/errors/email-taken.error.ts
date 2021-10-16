import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTakenError extends HttpException {
  constructor() {
    super('This email has already been taken.', HttpStatus.CONFLICT);
  }
}
