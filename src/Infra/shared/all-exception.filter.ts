/* eslint-disable dot-notation */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { ExceptionWithCode } from 'src/utils/exception-with-code';
import { QueryFailedError } from 'typeorm';

export interface IBaseRpcException extends RpcException {
  message: string;
  statusCode: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(`Core.${AllExceptionsFilter.name}`);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;
    const request = ctx.getRequest() as Request;

    this.logger.warn(`exception: ${exception}`);
    this.logger.warn(`path: ${JSON.stringify(request.path)}`);
    this.logger.warn(`request: ${request}`);
    this.logger.warn(`url: ${JSON.stringify(request.url)}`);
    this.logger.warn(`response: ${response.toString()}`);

    if (exception instanceof ExceptionWithCode) {
      const error = exception;
      this.logger.warn(`domain exception: ${error.toString()}`);

      const message = error?.message;

      response.status(400).json({
        message,
        statusCode: error['status'],
        errorCode: error['errorCode'],
        errorDetailsCode: error['errorDetailsCode'],
      });
      return;
    }

    if (exception instanceof ExceptionWithCode) {
      const error = exception;
      this.logger.warn(`domain exception: ${error.toString()}`);

      const message = error?.message;

      response.status(400).json({
        message,
        statusCode: error['status'],
        errorCode: error['errorCode'],
        errorDetailsCode: error['errorDetailsCode'],
      });
      return;
    }

    if (exception instanceof HttpException) {
      const { response: axiosResponse } = exception.getResponse() as {
        response: Record<
          string,
          {
            message: string;
          }
        >;
      };
      const error = exception;
      const status = error.getStatus();
      if (axiosResponse?.data) {
        response.status(status).json({
          message: axiosResponse.data?.message || exception.message,
          statusCode: status,
        });
        return;
      }
      const message = error.getResponse()['message'] || error?.getResponse();
      this.logger.warn(`http exception: ${error?.toString()}`);
      response.status(status).json({
        message,
        statusCode: status,
      });
      return;
    }

    if (exception instanceof AxiosError) {
      const error = exception;
      this.logger.warn(`axios exception: ${JSON.stringify(error)}`);
      const status = error?.response?.status || error?.status || 500;
      const message = error?.response?.data || {
        message: exception.message,
        statusCode: status,
      };

      response.status(Number(status)).json(message);
      return;
    }

    if (exception instanceof QueryFailedError) {
      const error = exception;
      this.logger.warn(`query exception: ${error.toString()}`);

      response.status(422).json({
        message: 'invalid UUID length',
        statusCode: 422,
      });
      return;
    }

    this.logger.warn(`unknown exception ${exception}`);
    this.logger.warn(JSON.stringify(exception));
    response.status(500).json({
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}
