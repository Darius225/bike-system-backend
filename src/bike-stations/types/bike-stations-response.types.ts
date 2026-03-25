import { StationInfoDto } from '../dto/station-info.dto';
import { StationStatusDto } from '../dto/station-status.dto';

// Define a type for responses that include 'stations' array
export interface StationsResponse {
  stations: StationInfoDto[]; // Use specific DTO type
}

// Define a type for responses that include 'station status' array
export interface StationStatusResponse {
  stations: StationStatusDto[]; // Use specific DTO type
}
