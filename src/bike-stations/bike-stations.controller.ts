import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BikeStationsService } from './bike-stations.service';
import { StationInfoDto } from './dto/station-info.dto';
import { ArrayOfObjectsResponseValidatorInterceptor } from '@src/common/interceptors/array-of-objects-response-validator.interceptor';
import { SingleObjectResponseValidatorInterceptor } from '@src/common/interceptors/single-object-response-validator.interceptor';
import { SystemInfoDto } from './dto/system-info.dto';
import { StationStatusDto } from './dto/station-status.dto';

@Controller('bike-stations')
export class BikeStationsController {
  constructor(private readonly bikeStationsService: BikeStationsService) {}

  @Get(':location/stations')
  @UseInterceptors(
    new ArrayOfObjectsResponseValidatorInterceptor(StationInfoDto),
  )
  async getStations(@Param('location') location: string) {
    try {
      return await this.bikeStationsService.getStationsByLocation(location);
    } catch {
      // Handle or transform error as needed
      throw new NotFoundException('Failed to fetch bike stations data');
    }
  }

  @Get(':location/system-info')
  @UseInterceptors(new SingleObjectResponseValidatorInterceptor(SystemInfoDto))
  async getSystemInfo(@Param('location') location: string) {
    try {
      const response =
        await this.bikeStationsService.getSystemInformationByLocation(location);
      return response;
    } catch {
      // Handle or transform error as needed
      throw new NotFoundException('Failed to fetch system information');
    }
  }

  // New endpoint for station status by station ID
  @Get(':location/station-status/:stationId')
  @UseInterceptors(
    new SingleObjectResponseValidatorInterceptor(StationStatusDto),
  )
  async getStationStatus(
    @Param('location') location: string,
    @Param('stationId') stationId: string,
  ) {
    try {
      const status = await this.bikeStationsService.getStationStatusById(
        location,
        stationId,
      );
      if (!status) {
        throw new NotFoundException(`Station with ID ${stationId} not found`);
      }
      return status;
    } catch {
      throw new BadRequestException('Failed to fetch station status');
    }
  }
}
