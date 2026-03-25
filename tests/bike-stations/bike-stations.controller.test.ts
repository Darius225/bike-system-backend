import { Test, TestingModule } from '@nestjs/testing';
import { BikeStationsController } from '@src/bike-stations/bike-stations.controller';
import { BikeStationsService } from '@src/bike-stations/bike-stations.service';
import { ArrayOfObjectsResponseValidatorInterceptor } from '@src/common/interceptors/array-of-objects-response-validator.interceptor';
import { SingleObjectResponseValidatorInterceptor } from '@src/common/interceptors/single-object-response-validator.interceptor';
import { plainToInstance } from 'class-transformer';
import { StationInfoDto } from '@src/bike-stations/dto/station-info.dto';
import { SystemInfoDto } from '@src/bike-stations/dto/system-info.dto';
import { StationStatusDto } from '@src/bike-stations/dto/station-status.dto';
import { BadRequestException } from '@nestjs/common';

// Mock the BikeStationsService
const mockBikeStationsService = {
  getStationsByLocation: jest.fn(),
  getSystemInformationByLocation: jest.fn(),
  getStationStatusById: jest.fn(), // Added mock method for getStationStatusById
};

// Mock the interceptors
const mockArrayOfObjectsResponseValidatorInterceptor = {
  intercept: jest.fn((context, next) => next.handle()), // Mock behavior: call next.handle() to return the data without validation
};

const mockSingleObjectResponseValidatorInterceptor = {
  intercept: jest.fn((context, next) => next.handle()), // Mock behavior: call next.handle() to return the data without validation
};

describe('BikeStationsController', () => {
  let controller: BikeStationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeStationsController],
      providers: [
        {
          provide: BikeStationsService,
          useValue: mockBikeStationsService,
        },
        {
          provide: ArrayOfObjectsResponseValidatorInterceptor,
          useValue: mockArrayOfObjectsResponseValidatorInterceptor,
        },
        {
          provide: SingleObjectResponseValidatorInterceptor,
          useValue: mockSingleObjectResponseValidatorInterceptor,
        },
      ],
    }).compile();

    controller = module.get<BikeStationsController>(BikeStationsController);
  });

  describe('getStations', () => {
    it('should return an array of stations', async () => {
      const mockStations = [
        { station_id: '1', name: 'Station 1', lat: 59.9139, lon: 10.7522 },
        { station_id: '2', name: 'Station 2', lat: 60.1234, lon: 10.5678 },
      ];

      mockBikeStationsService.getStationsByLocation.mockResolvedValue(
        mockStations,
      );

      const result = await controller.getStations('oslo');

      const expectedResult = mockStations.map((station) =>
        plainToInstance(StationInfoDto, station),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSystemInfo', () => {
    it('should return system information', async () => {
      const mockSystemInfo = {
        system_id: 'oslo',
        name: 'Oslo Bike System',
        operator: 'OsloBikes',
        bikes_available: 150,
        docks_available: 75,
      };

      mockBikeStationsService.getSystemInformationByLocation.mockResolvedValue(
        mockSystemInfo,
      );

      const result = await controller.getSystemInfo('oslo');

      const expectedResult = plainToInstance(SystemInfoDto, mockSystemInfo);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getStationStatus', () => {
    it('should return station status by ID', async () => {
      const location = 'oslo';
      const stationId = '123';
      const mockStatus: StationStatusDto = {
        station_id: stationId,
        num_bikes_available: 5,
        num_docks_available: 10,
        is_installed: true,
        is_renting: true,
        is_returning: true,
        last_reported: Date.now(), // Use timestamp number
      };

      mockBikeStationsService.getStationStatusById.mockResolvedValue(
        mockStatus,
      );

      const result = await controller.getStationStatus(location, stationId);

      const expectedResult = plainToInstance(StationStatusDto, mockStatus);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if station status is not found', async () => {
      const location = 'oslo';
      const stationId = '123';

      mockBikeStationsService.getStationStatusById.mockResolvedValue(null);

      await expect(
        controller.getStationStatus(location, stationId),
      ).rejects.toThrow(
        new BadRequestException('Failed to fetch station status'),
      );
    });

    it('should throw BadRequestException on service error', async () => {
      const location = 'oslo';
      const stationId = '123';

      mockBikeStationsService.getStationStatusById.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.getStationStatus(location, stationId),
      ).rejects.toThrow(
        new BadRequestException('Failed to fetch station status'),
      );
    });
  });
});
