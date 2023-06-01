import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { ApplicationConfigService } from './application-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
    }),
    KeycloakConnectModule.register({
      authServerUrl: process.env.BASE_URL,
      realm: process.env.REALM,
      clientId: process.env.CLIENT_ID,
      secret: process.env.SECRET,
    }),
  ],
  providers: [
    ApplicationConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [ApplicationConfigService],
})
export class ApplicationConfigModule {}
