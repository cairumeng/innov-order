import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordDoesntMatchError extends HttpException {
  constructor() {
    super('The password is not correct.', HttpStatus.FORBIDDEN);
  }
}
