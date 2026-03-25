import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class StationStatusDto {
  @IsString()
  station_id!: string;

  @IsNumber()
  @Min(0, {
    message: 'Number of bikes available must be a positive number or zero',
  }) // Custom message
  num_bikes_available!: number;

  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'Number of bikes disabled must be a positive number or zero',
  }) // Custom message
  num_bikes_disabled?: number;

  @IsNumber()
  @Min(0, {
    message: 'Number of docks available must be a positive number or zero',
  }) // Custom message
  num_docks_available!: number;

  @IsOptional()
  @IsNumber()
  @Min(0, {
    message: 'Number of docks disabled must be a positive number or zero',
  }) // Custom message
  num_docks_disabled?: number;

  @IsBoolean()
  is_installed!: boolean;

  @IsBoolean()
  is_renting!: boolean;

  @IsBoolean()
  is_returning!: boolean;

  @IsNumber()
  @Min(0, {
    message: 'Last reported timestamp must be a positive number or zero',
  }) // Custom message
  last_reported!: number;

  constructor(partial: Partial<StationStatusDto>) {
    Object.assign(this, partial);
  }
}
