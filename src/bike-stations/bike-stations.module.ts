import { Module } from '@nestjs/common';
import { BikeStationsController } from './bike-stations.controller';
import { BikeStationsService } from './bike-stations.service';
import { ConfigModule } from '@src/config/config.module';
import { ApiModule } from '@src/api/api.module';

@Module({
  imports: [ConfigModule, ApiModule],
  controllers: [BikeStationsController],
  providers: [BikeStationsService],
})
export class BikeStationsModule {}
