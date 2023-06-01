import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { ApplicationConfigDto } from './application-config.dto';

export interface IAppConfig {
  REALM: string;
  CLIENT_ID: string;
  SECRET: string;
  BASE_URL: string;
}

@Injectable()
export class ApplicationConfigService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ApplicationConfigService.name);
  constructor(private readonly configService: ConfigService) {
    this.REALM = this.configService.get<string>('REALM');
    this.CLIENT_ID = this.configService.get<string>('CLIENT_ID');
    this.SECRET = this.configService.get<string>('SECRET');
    this.BASE_URL = this.configService.get<string>('BASE_URL');
  }

  private REALM: string;
  private CLIENT_ID: string;
  private SECRET: string;
  private BASE_URL: string;

  async onApplicationBootstrap() {
    const applicationConfigDto = new ApplicationConfigDto({
      REALM: this.REALM,
      CLIENT_ID: this.CLIENT_ID,
      SECRET: this.SECRET,
      BASE_URL: this.BASE_URL,
    });
    try {
      const errors = await validate(applicationConfigDto);
      if (errors.length > 0) {
        throw new Error(
          JSON.stringify(
            errors.map((er) => er.constraints),
            null,
            2,
          ),
        );
      }
      this.logger.warn('*** ApplicationConfigService bootstraped ***');
    } catch (Err) {
      this.logger.error(Err);
      throw new Error(Err);
    }
  }

  getConfig(): IAppConfig {
    return {
      REALM: this.REALM,
      CLIENT_ID: this.CLIENT_ID,
      SECRET: this.SECRET,
      BASE_URL: this.BASE_URL,
    };
  }

  setConfig({ REALM, CLIENT_ID, SECRET, BASE_URL }): void {
    this.REALM = REALM;
    this.CLIENT_ID = CLIENT_ID;
    this.SECRET = SECRET;
    this.BASE_URL = BASE_URL;
  }
}
