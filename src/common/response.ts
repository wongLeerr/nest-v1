import { NestInterceptor, CallHandler, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          message: 'success',
          success: true,
          data,
        };
      }),
    );
  }
}
