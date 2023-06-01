import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ExceptionWithCode } from 'src/utils/exception-with-code';

import { IKeycloak } from './interfaces/IKeycloak';

@Injectable()
export class KeycloakAPI implements IKeycloak {
  private readonly urlSearchParams = new URLSearchParams({
    client_id: 'admin-cli',
    client_secret: process.env.CLIENT_SECRET_ADMIN,
    grant_type: 'client_credentials',
  });

  constructor(
    private readonly baseUrl: string,
    private readonly Realm: string,
  ) {}

  private readonly logger = new Logger(KeycloakAPI.name);

  async createUser(
    name: string,
    email: string,
    password: string,
    group: string,
    userId: string,
  ) {
    const data = await this.getAdminToken();
    try {
      await axios.post(
        `${this.baseUrl}/admin/realms/${this.Realm}/users`,
        {
          email,
          enabled: 'true',
          username: email,
          firstName: name,
          lastName: userId ?? '',
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: 'false',
            },
          ],
          emailVerified: true,
          groups: [group],
          attributes: {
            userId,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async getUserByEmail(
    email: string,
    token: string,
  ): Promise<{
    data: {
      id: string;
      firstName: string;
      attributes: {
        userId: string;
      };
    }[];
  }> {
    const userData = await axios.get(
      `${this.baseUrl}/admin/realms/${this.Realm}/users?username=${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return userData;
  }

  async getUserById(userId: string) {
    const data = await this.getAdminToken();
    try {
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.Realm}/users?lastName=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );

      return response;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async updateUser(email: string, newEmail: string) {
    const data = await this.getAdminToken().catch((err) => {
      this.logger.error(err);
      return err;
    });

    const userData = await this.getUserByEmail(email, data.access_token).catch(
      (err) => {
        this.logger.error(err, err.stack);
        return err;
      },
    );
    if (userData.data.length === 0) {
      this.logger.error('User not found', "Can't update user in auth server");
      return;
    }

    await axios
      .put(
        `${this.baseUrl}/admin/realms/${this.Realm}/users/${userData.data[0].id}`,
        {
          email: newEmail,
          enabled: 'true',
          username: newEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      )
      .catch((err) => {
        this.logger.error(err);
      });
  }

  async deleteUser(email: string) {
    const data = await this.getAdminToken();

    const userData = await this.getUserByEmail(email, data.access_token);

    if (!userData.data.length) {
      this.logger.error('User not found');
      return;
    }

    await axios.delete(
      `${this.baseUrl}/admin/realms/${this.Realm}/users/${userData.data[0].id}`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );
  }

  async getAdminToken(): Promise<{
    access_token: string;
  }> {
    const { data } = await axios.post(
      `${this.baseUrl}/realms/master/protocol/openid-connect/token`,
      this.urlSearchParams,
    );

    return data;
  }

  async login(email: string, password: string) {
    const urlSearchParamsLogin = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.SECRET,
      grant_type: 'password',
      username: email,
      password,
    });
    const url = `${this.baseUrl}/realms/${this.Realm}/protocol/openid-connect/token`;
    const data = await axios.post(url, urlSearchParamsLogin);
    return data.data;
  }

  async loginRefresh(token: string) {
    const urlSearchParamsLogin = new URLSearchParams({
      client_id: 'admin-cli',
      client_secret: process.env.SECRET,
      grant_type: 'refresh_token',
      refresh_token: token,
    });
    const data = await axios.post(
      `${this.baseUrl}/realms/${this.Realm}/protocol/openid-connect/token`,
      urlSearchParamsLogin,
    );

    return data.data;
  }

  async checkUser(email: string) {
    const data = await this.getAdminToken();

    const userData = await this.getUserByEmail(email, data.access_token);

    if (userData.data[0] !== undefined)
      throw new ExceptionWithCode(
        `The email ${email} is already registered`,
        400,
        'CO17',
        'CO3',
      );
  }
}
