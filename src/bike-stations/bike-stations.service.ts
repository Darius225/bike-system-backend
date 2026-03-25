import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { StationInfoDto } from './dto/station-info.dto';
import { StationStatusDto } from './dto/station-status.dto';
import { SystemInfoDto } from './dto/system-info.dto';
import { ApiService } from '@src/api/api.service';

@Injectable()
export class BikeStationsService {
  private readonly locationUrls: Record<string, string>;

  constructor(
    @Inject('GBFS_SERVICE_BASE_URL') baseUrl: string,
    private readonly apiService: ApiService,
  ) {
    this.locationUrls = {
      oslo: `${baseUrl}oslobysykkel.no`,
      bergen: `${baseUrl}bergenbysykkel.no`,
      milan: `${baseUrl}bikemi.com`,
      default: baseUrl,
    };
  }

  private getBaseUrl(location: string): string {
    return this.locationUrls[location] || this.locationUrls['default'];
  }

  async getStationsByLocation(location: string): Promise<StationInfoDto[]> {
    const url = `${this.getBaseUrl(location)}/station_information.json`;
    return this.apiService.fetchMultipleObjects<StationInfoDto>(
      url,
      'stations',
    );
  }

  async getStationStatusByLocation(
    location: string,
  ): Promise<StationStatusDto[]> {
    const url = `${this.getBaseUrl(location)}/station_status.json`;
    return this.apiService.fetchMultipleObjects<StationStatusDto>(
      url,
      'stations',
    );
  }

  async getSystemInformationByLocation(
    location: string,
  ): Promise<SystemInfoDto> {
    const url = `${this.getBaseUrl(location)}/system_information.json`;
    return this.apiService.fetchSingleObject<SystemInfoDto>(url);
  }

  async getStationStatusById(
    location: string,
    stationId: string,
  ): Promise<StationStatusDto | null> {
    const stations = await this.getStationStatusByLocation(location);
    const station = stations.find(
      (station) => station.station_id === stationId,
    );

    if (!station) {
      throw new NotFoundException(`Station with ID ${stationId} not found`);
    }

    return station;
  }
}
