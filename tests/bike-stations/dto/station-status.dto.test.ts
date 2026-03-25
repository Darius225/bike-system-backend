import { StationStatusDto } from '@src/bike-stations/dto/station-status.dto';
import { validate } from 'class-validator';

describe('StationStatusDto Validation Tests', () => {
  let validDto: StationStatusDto;

  beforeEach(() => {
    validDto = new StationStatusDto({
      station_id: '123',
      num_bikes_available: 10,
      num_docks_available: 5,
      is_installed: true,
      is_renting: true,
      is_returning: false,
      last_reported: 1620000000,
    });
  });

  describe('Basic Validations', () => {
    it('should pass validation with valid data', async () => {
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with optional fields omitted', async () => {
      const minimalDto = new StationStatusDto({
        station_id: '123',
        num_bikes_available: 10,
        num_docks_available: 5,
        is_installed: true,
        is_renting: true,
        is_returning: false,
        last_reported: 1620000000,
      });
      const errors = await validate(minimalDto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Field-Specific Validations', () => {
    it('should return an error if station_id is missing', async () => {
      (validDto.station_id as unknown) = undefined;
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('station_id');
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should return an error if num_bikes_available is negative', async () => {
      validDto.num_bikes_available = -1;
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBe(
        'Number of bikes available must be a positive number or zero',
      );
    });

    it('should return an error if num_docks_available is negative', async () => {
      validDto.num_docks_available = -1;
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBe(
        'Number of docks available must be a positive number or zero',
      );
    });

    it('should return an error if last_reported is negative', async () => {
      validDto.last_reported = -1;
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBe(
        'Last reported timestamp must be a positive number or zero',
      );
    });

    it('should return an error if num_bikes_disabled is negative', async () => {
      validDto.num_bikes_disabled = -5;
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBe(
        'Number of bikes disabled must be a positive number or zero',
      );
    });

    it('should return an error if num_docks_disabled is negative', async () => {
      validDto.num_docks_disabled = -3;
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.min).toBe(
        'Number of docks disabled must be a positive number or zero',
      );
    });

    it('should return an error if is_installed is not a boolean', async () => {
      (validDto.is_installed as unknown) = 'yes'; // Invalid boolean value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('is_installed');
      expect(errors[0].constraints?.isBoolean).toBeDefined();
    });

    it('should return an error if is_renting is not a boolean', async () => {
      (validDto.is_renting as unknown) = 'true'; // Invalid boolean value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('is_renting');
      expect(errors[0].constraints?.isBoolean).toBeDefined();
    });

    it('should return an error if is_returning is not a boolean', async () => {
      (validDto.is_returning as unknown) = 0; // Invalid boolean value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('is_returning');
      expect(errors[0].constraints?.isBoolean).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should pass validation with num_bikes_available as 0', async () => {
      validDto.num_bikes_available = 0;
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with num_docks_available as 0', async () => {
      validDto.num_docks_available = 0;
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with last_reported as 0', async () => {
      validDto.last_reported = 0;
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid Input', () => {
    it('should return an error if num_bikes_available is not a number', async () => {
      (validDto.num_bikes_available as unknown) = 'ten'; // Invalid value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('num_bikes_available');
      expect(errors[0].constraints?.isNumber).toBeDefined();
    });

    it('should return an error if last_reported is not a number', async () => {
      (validDto.last_reported as unknown) = 'now'; // Invalid value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('last_reported');
      expect(errors[0].constraints?.isNumber).toBeDefined();
    });

    it('should return an error if is_installed is not a boolean', async () => {
      (validDto.is_installed as unknown) = 1; // Invalid value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('is_installed');
      expect(errors[0].constraints?.isBoolean).toBeDefined();
    });

    it('should return an error if is_renting is not a boolean', async () => {
      (validDto.is_renting as unknown) = {}; // Invalid value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('is_renting');
      expect(errors[0].constraints?.isBoolean).toBeDefined();
    });

    it('should return an error if is_returning is not a boolean', async () => {
      (validDto.is_returning as unknown) = []; // Invalid value
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('is_returning');
      expect(errors[0].constraints?.isBoolean).toBeDefined();
    });
  });
});
