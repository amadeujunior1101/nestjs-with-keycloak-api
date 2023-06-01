import { HttpException } from '@nestjs/common';

export class ExceptionWithCode extends HttpException {
  private errorCode: string;
  private errorDetailsCode: string;
  constructor(
    message: string,
    status: number,
    errorCode: string,
    errorDetailsCode: string,
  ) {
    super(message, status);
    this.errorCode = errorCode;
    this.errorDetailsCode = errorDetailsCode;
  }
}
