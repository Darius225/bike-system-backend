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
export class ArrayOfObjectsResponseValidatorInterceptor<T>
  implements NestInterceptor
{
  constructor(private readonly dtoClass: Constructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(async (data: unknown[]) => {
        if (!Array.isArray(data)) {
          throw new BadRequestException('Expected an array of objects');
        }

        // Transform data to DTO instances
        const items = data.map((item) => plainToInstance(this.dtoClass, item));

        // Validate each item in the array
        const validationPromises = items.map((item) =>
          validate(item as object),
        );
        const validationResults = await Promise.all(validationPromises);
        const errors = validationResults.flat();

        if (errors.length > 0) {
          const errorMessages = errors.flatMap((error) =>
            Object.values(error.constraints || {}),
          );
          throw new BadRequestException(
            `Invalid data format from GFBS system: ${errorMessages.join(', ')}`,
          );
        }

        return items;
      }),
    );
  }
}
