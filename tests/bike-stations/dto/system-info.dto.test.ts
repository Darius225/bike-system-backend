import { StationInfoDto } from '@src/bike-stations/dto/station-info.dto';
import { validate } from 'class-validator';

describe('StationInfoDto', () => {
  let validDto: StationInfoDto;

  beforeEach(() => {
    validDto = new StationInfoDto({
      station_id: '123',
      name: 'Central Station',
      lat: 59.9139,
      lon: 10.7522,
    });
  });

  // 1. Valid Input Tests
  describe('Valid Inputs', () => {
    it('should validate successfully with all required fields', async () => {
      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with optional fields', async () => {
      validDto.short_name = 'CS';
      validDto.address = 'Central Ave';
      validDto.cross_street = 'Main St';
      validDto.region_id = '1';
      validDto.post_code = '12345';
      validDto.rental_methods = ['CREDITCARD', 'CASH'];
      validDto.capacity = 25;

      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });

    it('should validate successfully with a partial object using the constructor', async () => {
      const partialDto = new StationInfoDto({
        station_id: '001',
        name: 'Bike Station',
        lat: 40.7128,
        lon: -74.006,
      });

      const errors = await validate(partialDto);
      expect(errors.length).toBe(0);
    });
  });

  // 2. Invalid Input Tests
  describe('Invalid Inputs', () => {
    it('should fail validation if station_id is not a string', async () => {
      (validDto.station_id as unknown) = 123; // Invalid type
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation if name is not a string', async () => {
      (validDto.name as unknown) = 123; // Invalid type
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation if lat is not a valid latitude', async () => {
      validDto.lat = 100; // Invalid latitude (out of range)
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isLatitude).toBeDefined();
    });

    it('should fail validation if lon is not a valid longitude', async () => {
      validDto.lon = 200; // Invalid longitude (out of range)
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isLongitude).toBeDefined();
    });

    it('should fail validation if short_name is not a string', async () => {
      (validDto.short_name as unknown) = 123; // Invalid type
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation if address is not a string', async () => {
      (validDto.address as unknown) = 123; // Invalid type
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation if rental_methods is not an array', async () => {
      (validDto.rental_methods as unknown) = 'CREDITCARD'; // Invalid type
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isArray).toBeDefined();
    });

    it('should fail validation if capacity is not a number', async () => {
      (validDto.capacity as unknown) = 'fifteen'; // Invalid type
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNumber).toBeDefined();
    });
  });

  // 3. Edge Cases Tests
  describe('Edge Cases', () => {
    it('should fail validation if station_id is an empty string', async () => {
      validDto.station_id = ''; // Empty string
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toBeUndefined();
    });

    it('should fail validation if lat is exactly on the edge of invalid range', async () => {
      validDto.lat = 90.1; // Invalid latitude
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isLatitude).toBeDefined();
    });

    it('should fail validation if lon is exactly on the edge of invalid range', async () => {
      validDto.lon = 180.1; // Invalid longitude
      const errors = await validate(validDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isLongitude).toBeDefined();
    });

    it('should pass validation if rental_methods is an empty array', async () => {
      validDto.rental_methods = [];
      const errors = await validate(validDto);
      expect(errors.length).toBe(0); // Empty array is valid
    });

    it('should pass validation if optional fields are not provided', async () => {
      delete validDto.short_name;
      delete validDto.address;
      delete validDto.cross_street;
      delete validDto.region_id;
      delete validDto.post_code;
      delete validDto.rental_methods;
      delete validDto.capacity;

      const errors = await validate(validDto);
      expect(errors.length).toBe(0);
    });
  });
});
