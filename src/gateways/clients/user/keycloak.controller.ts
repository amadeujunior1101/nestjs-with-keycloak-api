/* eslint-disable @typescript-eslint/no-var-requires */
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { KeycloakAPI } from 'src/Infra/integrations/KeycloakAPI';
import { AllExceptionsFilter } from 'src/Infra/shared/all-exception.filter';
import { LoginDTO } from 'src/gateways/dtos/user/keycloak/loginDTO';
import { LoginRefreshDTO } from 'src/gateways/dtos/user/keycloak/loginRefreshDTO';
import { ExceptionWithCode } from 'src/utils/exception-with-code';

@Controller('')
@UseFilters(new AllExceptionsFilter())
export class KeycloakController {
  constructor(private readonly keycloak: KeycloakAPI) {}

  @Post('login')
  @Unprotected()
  async login(@Body() data: LoginDTO) {
    try {
      return await this.keycloak.login(data.email, data.password);
    } catch (err) {
      throw new ExceptionWithCode(
        err.message || 'something went wrong',
        err.status || 400,
        err.errorCode || 'KE1',
        err.errorDetailsCode || 'KE3',
      );
    }
  }

  @Post('loginRefresh')
  @Unprotected()
  async loginRefresh(@Body() data: LoginRefreshDTO) {
    try {
      const tokens = await this.keycloak.loginRefresh(data.token);

      return tokens;
    } catch (err) {
      throw new ExceptionWithCode('something went wrong', 400, 'CO40', 'CO3');
    }
  }
}
