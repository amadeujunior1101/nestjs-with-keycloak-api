import { HttpException, Logger } from '@nestjs/common';
import jwt_decode from 'jwt-decode';

export default class RoleValidator {
  static execRealm(token: string, roles: string[]): string {
    const decoded = this.baseExecRealm(token, roles);
    return decoded.email;
  }

  static execResource(token: string, roles: string[]): string {
    const decoded = this.baseExecResource(token, roles);
    return decoded.email;
  }

  private static logger = new Logger(RoleValidator.name);

  private static baseExecRealm(token: string, roles: string[]) {
    const decoded: {
      email: string;
      enterpriseId: string;
      userId: string;
      realm_access: {
        roles: string[];
      };
      name: string;
    } = jwt_decode(token);

    if (roles.length === 1) {
      const validRoles = decoded.realm_access.roles.includes(roles[0]);

      if (!validRoles) throw new HttpException('Forbidden resource', 403);
    }

    if (roles.length === 2) {
      const validManagerRole = decoded.realm_access.roles.includes(roles[0]);
      const validFuncionariosRole = decoded.realm_access.roles.includes(
        roles[1],
      );

      if (!(validManagerRole || validFuncionariosRole))
        throw new HttpException('Forbidden resource', 403);
    }

    return decoded;
  }

  private static baseExecResource(token: string, roles: string[]) {
    const clientId = process.env.CLIENT_ID;

    const resourceAccess = {
      [clientId]: {
        roles: [],
      },
    };

    const decoded: {
      email: string;
      enterpriseId: string;
      userId: string;
      resource_access: typeof resourceAccess;
      name: string;
    } = jwt_decode(token);

    if (roles.length === 1) {
      const validRoles = decoded.resource_access[clientId].roles.includes(
        roles[0],
      );

      if (!validRoles) throw new HttpException('Forbidden resource', 403);
    }

    if (roles.length === 2) {
      const validManagerRole = decoded.resource_access[clientId].roles.includes(
        roles[0],
      );
      const validFuncionariosRole = decoded.resource_access[
        clientId
      ].roles.includes(roles[1]);

      if (!(validManagerRole || validFuncionariosRole))
        throw new HttpException('Forbidden resource', 403);
    }

    return decoded;
  }

  static execRealmWithUserId(token: string, roles: string[]): string {
    const decoded = this.baseExecRealm(token, roles);
    return decoded.userId;
  }

  static execResourceWithUserId(token: string, roles: string[]): string {
    const decoded = this.baseExecResource(token, roles);
    return decoded.userId;
  }
}
