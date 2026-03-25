import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async fetchMultipleObjects<T>(url: string, dataKey: string): Promise<T[]> {
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const data = response.data.data;

      if (data && Array.isArray(data[dataKey])) {
        return data[dataKey] as T[];
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error(`Failed to fetch ${dataKey.replace('_', ' ')}`, error);
      return [] as T[]; // Return an empty array in case of failure
    }
  }

  async fetchSingleObject<T>(url: string): Promise<T> {
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const data = response.data.data;

      if (data) {
        return data as T;
      }

      throw new Error('Unexpected response format');
    } catch (error) {
      console.error(`Failed to fetch data from ${url}`, error);
      throw new Error(`Data not found for ${url}`);
    }
  }
}
