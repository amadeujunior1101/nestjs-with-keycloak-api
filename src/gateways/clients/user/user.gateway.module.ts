import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAPI } from 'src/Infra/integrations/KeycloakAPI';
import { KeycloakController } from 'src/gateways/clients/user/keycloak.controller';

@Module({
  imports: [],
  controllers: [KeycloakController],
  providers: [
    ConfigService,
    {
      provide: KeycloakAPI,
      useFactory: (configService: ConfigService) => {
        const url = configService.get('BASE_URL');
        const realm = configService.get('REALM');
        return new KeycloakAPI(url, realm);
      },
      inject: [ConfigService],
    },
  ],
  exports: [KeycloakAPI],
})
export class UserGatewayModule {}
