import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ArrayOfObjectsResponseValidatorInterceptor } from '@src/common/interceptors/array-of-objects-response-validator.interceptor';

// Mock the validate function from class-validator
jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

const mockedValidate = validate as jest.MockedFunction<typeof validate>;

// Simplified DTO-like object (no decorators)
class SimpleDto {
  id!: string;
  name!: string;

  constructor(partial: Partial<SimpleDto>) {
    Object.assign(this, partial);
  }
}

describe('ArrayObjectResponseValidatorInterceptor ', () => {
  let interceptor: ArrayOfObjectsResponseValidatorInterceptor<SimpleDto>;

  beforeEach(() => {
    interceptor = new ArrayOfObjectsResponseValidatorInterceptor(SimpleDto);
    jest.resetAllMocks(); // Reset mocks before each test to ensure clean state
  });

  describe('Success Case', () => {
    it('should process array of objects without errors', async () => {
      // Arrange
      const mockData = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      // Mock validate to return no errors
      mockedValidate.mockResolvedValue([]); // No validation errors

      const mockCallHandler: Partial<CallHandler> = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      };

      // Act
      const result$ = interceptor.intercept(
        {} as ExecutionContext,
        mockCallHandler as CallHandler,
      );
      const result = await firstValueFrom(result$); // Ensure observable completes

      // Assert
      expect(result).toEqual(
        mockData.map((item) => plainToInstance(SimpleDto, item)),
      );
      expect(mockedValidate).toHaveBeenCalledTimes(2); // Once for each item
    });
  });

  describe('Failure Case', () => {
    it('should throw BadRequestException when any validation fails', async () => {
      // Arrange
      const mockData = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      // Mock validation errors for multiple objects
      const mockValidationErrors: ValidationError[] = [
        {
          property: 'name',
          constraints: { isNotEmpty: 'name should not be empty' },
          children: [],
        },
      ];

      mockedValidate.mockResolvedValue(mockValidationErrors); // Return validation errors

      const mockCallHandler: Partial<CallHandler> = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      };

      // Act and Assert
      await expect(
        firstValueFrom(
          interceptor.intercept(
            {} as ExecutionContext,
            mockCallHandler as CallHandler,
          ),
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockedValidate).toHaveBeenCalledTimes(2); // Once for each item
    });
  });
});
