import { StationInfoDto } from '@src/bike-stations/dto/station-info.dto';
import { validate } from 'class-validator';

describe('StationInfoDto Validation', () => {
  let validDto: StationInfoDto;

  beforeEach(() => {
    validDto = new StationInfoDto({
      station_id: '123',
      name: 'Station Name',
      lat: 40.7128,
      lon: -74.006,
    });
  });

  describe('Valid Inputs', () => {
    it('should validate successfully with all required fields', async () => {
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with optional fields', async () => {
      validDto = new StationInfoDto({
        station_id: '123',
        name: 'Station Name',
        lat: 40.7128,
        lon: -74.006,
        short_name: 'Short Name',
        address: '123 Main St',
        cross_street: 'Cross St',
        region_id: 'Region1',
        post_code: '12345',
        rental_methods: ['method1', 'method2'],
        capacity: 10,
      });
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid Inputs', () => {
    it('should return an error if station_id is missing', async () => {
      validDto.station_id = '';
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('station_id');
      expect(errors[0].constraints?.isNotEmpty).toBe(
        'station_id cannot be empty',
      );
    });

    it('should return an error if name is missing', async () => {
      validDto.name = '';
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isNotEmpty).toBe('name cannot be empty');
    });

    it('should return an error if lat is invalid', async () => {
      validDto.lat = 91; // Invalid latitude
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lat');
      expect(errors[0].constraints?.isLatitude).toBeDefined();
    });

    it('should return an error if lon is invalid', async () => {
      validDto.lon = 181; // Invalid longitude
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lon');
      expect(errors[0].constraints?.isLongitude).toBeDefined();
    });

    it('should return an error if capacity is not a number', async () => {
      (validDto.capacity as unknown) = 'ten'; // Invalid capacity
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('capacity');
      expect(errors[0].constraints?.isNumber).toBeDefined();
    });

    it('should return an error if rental_methods is not an array', async () => {
      (validDto.rental_methods as unknown) = 'not an array'; // Invalid rental_methods
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('rental_methods');
      expect(errors[0].constraints?.isArray).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should validate successfully with all optional fields set to undefined', async () => {
      validDto = new StationInfoDto({
        station_id: '123',
        name: 'Station Name',
        lat: 40.7128,
        lon: -74.006,
        short_name: undefined,
        address: undefined,
        cross_street: undefined,
        region_id: undefined,
        post_code: undefined,
        rental_methods: undefined,
        capacity: undefined,
      });
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should return an error if an invalid type is passed for latitude', async () => {
      (validDto.lat as unknown) = 'invalid'; // Invalid type for latitude
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lat');
      expect(errors[0].constraints?.isLatitude).toBeDefined();
    });

    it('should return an error if an invalid type is passed for longitude', async () => {
      (validDto.lon as unknown) = 'invalid'; // Invalid type for longitude
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lon');
      expect(errors[0].constraints?.isLongitude).toBeDefined();
    });
  });
});
