import { ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionRes: any = exception.getResponse();
    const error = exceptionRes.error;
    let message = exceptionRes.message;

    if (status === 401) {
      message = '身份过期，请重新登录';
    }

    response.status(200).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      msg: message,
    });
  }
}
