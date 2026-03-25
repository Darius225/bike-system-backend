import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { BikeStationsModule } from './bike-stations/bike-stations.module';
import { HttpModule } from '@nestjs/axios';
import { ApiModule } from './api/api.module';

@Module({
  imports: [HttpModule, ConfigModule, BikeStationsModule, ApiModule],
})
export class AppModule {}
