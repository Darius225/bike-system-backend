import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { StationInfoDto } from '@src/bike-stations/dto/station-info.dto';
import { SystemInfoDto } from '@src/bike-stations/dto/system-info.dto';
import { StationStatusDto } from '@src/bike-stations/dto/station-status.dto';
// Helper function for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('BikeStationsController E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const cities = ['oslo', 'bergen', 'milan'];

  describe.each(cities)('Endpoints for city: %s', (city) => {
    describe(`/bike-stations/${city}/stations`, () => {
      it('should fetch stations', async () => {
        const response = await request(app.getHttpServer())
          .get(`/bike-stations/${city}/stations`)
          .expect(200);

        // Verify response format
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((station: StationInfoDto) => {
          expect(station).toHaveProperty('station_id');
          expect(station).toHaveProperty('name');
          expect(station).toHaveProperty('lat');
          expect(station).toHaveProperty('lon');
        });

        // Delay between requests to avoid hitting the server too fast
        await delay(1000); // 1 second delay
      });
    });

    describe(`/bike-stations/${city}/system-info`, () => {
      it('should fetch system info', async () => {
        const response = await request(app.getHttpServer()).get(
          `/bike-stations/${city}/system-info`,
        );

        const systemInfo: SystemInfoDto = response.body;

        expect(systemInfo).toHaveProperty('system_id');
        expect(systemInfo).toHaveProperty('name');

        // Delay between requests to avoid hitting the server too fast
        await delay(1000); // 1 second delay
      });
    });

    describe(`Testing :location/station-status/:stationId`, () => {
      it('should fetch station status based on id', async () => {
        // Step 1: Fetch all stations for the given city
        const stationsResponse = await request(app.getHttpServer())
          .get(`/bike-stations/${city}/stations`)
          .expect(200);

        // Validate the stations response is an array
        const stations: StationInfoDto[] = stationsResponse.body;
        expect(Array.isArray(stations)).toBe(true);
        expect(stations.length).toBeGreaterThan(0);

        // Step 2: Get the first station's ID
        const firstStationId = stations[0].station_id;

        // Step 3: Query station status using the first station's ID
        const statusResponse = await request(app.getHttpServer())
          .get(`/bike-stations/${city}/station-status/${firstStationId}`)
          .expect(200);

        // Step 4: Validate the station status response
        const stationStatus: StationStatusDto = statusResponse.body;
        expect(stationStatus).toHaveProperty('station_id', firstStationId);
        expect(stationStatus).toHaveProperty('num_bikes_available');
        expect(stationStatus).toHaveProperty('num_docks_available');
      });
    });
  });
});
