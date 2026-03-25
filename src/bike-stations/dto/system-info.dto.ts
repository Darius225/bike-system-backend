import { IsString, IsUrl, IsOptional, IsDateString } from 'class-validator';

export class SystemInfoDto {
  @IsString()
  system_id!: string;

  @IsString()
  language!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  short_name?: string;

  @IsOptional()
  @IsString()
  operator?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsUrl()
  purchase_url?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsString() // Simpler to use string for now as for formatting issues.
  phone_number?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  timezone!: string;

  @IsOptional()
  @IsUrl()
  license_url?: string;

  constructor(partial: Partial<SystemInfoDto>) {
    Object.assign(this, partial);
  }
}
