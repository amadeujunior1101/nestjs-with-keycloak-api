import { IsString } from 'class-validator';
import { IAppConfig } from './application-config.service';

export class ApplicationConfigDto implements IAppConfig {
  @IsString({ message: 'REALM is required' })
  REALM: string;
  @IsString({ message: 'CLIENT_ID is required' })
  CLIENT_ID: string;
  @IsString({ message: 'SECRET is required' })
  SECRET: string;
  @IsString({ message: 'BASE_URL is required' })
  BASE_URL: string;

  constructor(data: IAppConfig) {
    Object.assign(this, data);
  }
}
