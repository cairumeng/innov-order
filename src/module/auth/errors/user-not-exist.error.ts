import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotExistError extends HttpException {
  constructor() {
    super('This email does not exist.', HttpStatus.FORBIDDEN);
  }
}
