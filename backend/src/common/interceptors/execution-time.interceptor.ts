import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExecutionTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;
        const request = context.switchToHttp().getRequest();

        this.logger.log(
          `${request.method} ${request.originalUrl} completed in ${duration}ms`,
        );
      }),
    );
  }
}
