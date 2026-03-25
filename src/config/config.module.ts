// src/config/config.module.ts
import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot(), // Ensure this loads the .env file
  ],
  providers: [
    {
      provide: 'GBFS_SERVICE_BASE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('GBFS_SERVICE_BASE_URL'),
      inject: [ConfigService],
    },
  ],
  exports: ['GBFS_SERVICE_BASE_URL'], // Export the GBFS_SERVICE_BASE_URL so it can be used in other modules
})
export class ConfigModule {}
