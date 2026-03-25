import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
} from 'class-validator';

export class StationInfoDto {
  @IsString()
  @IsNotEmpty({ message: 'station_id cannot be empty' })
  station_id!: string;

  @IsString()
  @IsNotEmpty({ message: 'name cannot be empty' })
  name!: string;

  @IsOptional()
  @IsString()
  short_name?: string;

  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lon!: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  cross_street?: string;

  @IsOptional()
  @IsString()
  region_id?: string;

  @IsOptional()
  @IsString()
  post_code?: string;

  @IsOptional()
  @IsArray()
  rental_methods?: string[];

  @IsOptional()
  @IsNumber()
  capacity?: number;

  constructor(partial: Partial<StationInfoDto>) {
    Object.assign(this, partial);
  }
}
