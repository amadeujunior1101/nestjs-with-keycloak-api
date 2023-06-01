/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { KeycloakAPI } from 'src/Infra/integrations/KeycloakAPI';

@Injectable()
export class CreateUserInterceptor implements NestInterceptor {
  private keycloak: KeycloakAPI;
  constructor() {
    this.keycloak = new KeycloakAPI(process.env.BASE_URL, process.env.REALM);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (value) => {
        const { body } = context.switchToHttp().getRequest<any>();
        const name = body.name.split(' ');
        const firstName = body.name[0].toUpperCase() + name[0].slice(1);
        const password = body.email;

        await this.keycloak.createUser(
          firstName,
          body.email,
          password,
          'Group-dev',
          value.id,
        );
      }),
    );
  }
}
