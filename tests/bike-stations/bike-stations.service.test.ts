import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from '@src/api/api.service'; // Make sure the path is correct
import { NotFoundException } from '@nestjs/common';
import { BikeStationsService } from '@src/bike-stations/bike-stations.service';
import { StationStatusDto } from '@src/bike-stations/dto/station-status.dto';
import { SystemInfoDto } from '@src/bike-stations/dto/system-info.dto';
import { StationInfoDto } from '@src/bike-stations/dto/station-info.dto';

describe('BikeStationsService', () => {
  let service: BikeStationsService;
  let apiService: ApiService;

  // Mock Data
  const mockStations: StationInfoDto[] = [
    { station_id: '1', name: 'Station 1', capacity: 5, lat: 0.0, lon: 0.0 },
    { station_id: '2', name: 'Station 2', capacity: 3, lat: 0.0, lon: 0.0 },
  ];

  const mockStationStatuses: StationStatusDto[] = [
    {
      station_id: '1',
      num_bikes_available: 5,
      num_docks_available: 10,
      is_installed: true,
      is_renting: true,
      is_returning: true,
      last_reported: 1620000000,
    },
    {
      station_id: '2',
      num_bikes_available: 3,
      num_docks_available: 8,
      is_installed: true,
      is_renting: true,
      is_returning: true,
      last_reported: 1620000000,
    },
  ];

  const mockSystemInfo: SystemInfoDto = {
    system_id: 'oslo',
    name: 'Oslo Bike System',
    operator: 'OsloBikes',
    language: 'no',
    timezone: 'Europe/Oslo',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BikeStationsService,
        {
          provide: ApiService,
          useValue: {
            fetchMultipleObjects: jest.fn(),
            fetchSingleObject: jest.fn(),
          },
        },
        {
          provide: 'GBFS_SERVICE_BASE_URL',
          useValue: 'http://test-url/',
        },
      ],
    }).compile();

    service = module.get<BikeStationsService>(BikeStationsService);
    apiService = module.get<ApiService>(ApiService);
  });

  describe('getStationsByLocation', () => {
    it('should return an array of station info', async () => {
      // Mock ApiService.fetchMultipleObjects for station info
      jest
        .spyOn(apiService, 'fetchMultipleObjects')
        .mockResolvedValue(mockStations);

      const result = await service.getStationsByLocation('oslo');
      expect(result).toEqual(mockStations);
    });

    it('should return an empty array if stations are not found', async () => {
      jest.spyOn(apiService, 'fetchMultipleObjects').mockResolvedValue([]);

      const result = await service.getStationsByLocation('oslo');
      expect(result).toEqual([]);
    });
  });

  describe('getStationStatusByLocation', () => {
    it('should return an array of station statuses', async () => {
      jest
        .spyOn(apiService, 'fetchMultipleObjects')
        .mockResolvedValue(mockStationStatuses);

      const result = await service.getStationStatusByLocation('oslo');
      expect(result).toEqual(mockStationStatuses);
    });
  });

  describe('getSystemInformationByLocation', () => {
    it('should return system information', async () => {
      jest
        .spyOn(apiService, 'fetchSingleObject')
        .mockResolvedValue(mockSystemInfo);

      const result = await service.getSystemInformationByLocation('oslo');
      expect(result).toEqual(mockSystemInfo);
    });

    it('should throw NotFoundException if system info is not found', async () => {
      jest
        .spyOn(apiService, 'fetchSingleObject')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.getSystemInformationByLocation('oslo'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStationStatusById', () => {
    it('should return a specific station status by ID', async () => {
      jest
        .spyOn(apiService, 'fetchMultipleObjects')
        .mockResolvedValue(mockStationStatuses);

      const result = await service.getStationStatusById('oslo', '1');
      expect(result).toEqual(mockStationStatuses[0]);
    });

    it('should throw NotFoundException if station ID not found', async () => {
      jest
        .spyOn(apiService, 'fetchMultipleObjects')
        .mockResolvedValue(mockStationStatuses);

      await expect(service.getStationStatusById('oslo', '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
