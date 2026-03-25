import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// Define a constructor type that matches your DTO's constructor signature
type Constructor<T> = new (partial: Partial<T>) => T;
@Injectable()
export class SingleObjectResponseValidatorInterceptor<T>
  implements NestInterceptor
{
  constructor(private readonly dtoClass: Constructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(async (data) => {
        const object = plainToInstance(this.dtoClass, data) as object;
        const errors = await validate(object);

        if (errors.length > 0) {
          const errorMessages = errors.flatMap((error) =>
            Object.values(error.constraints || {}),
          );
          throw new BadRequestException(
            `Invalid data format from GFBS system: ${errorMessages.join(', ')}`,
          );
        }

        return object;
      }),
    );
  }
}
