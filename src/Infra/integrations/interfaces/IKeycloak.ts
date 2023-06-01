import { AxiosError } from 'axios';

export interface IKeycloak {
  createUser(
    email: string,
    password: string,
    role: string,
    name: string,
    userId: string,
    enterpriseId: string,
  ): void | Promise<AxiosError>;
  updateUser(email: string, newEmail: string): Promise<void>;
  deleteUser(email: string): Promise<void>;
  checkUser(email: string): Promise<void>;
  login(email: string, password: string): Promise<{ access_token: string }>;
}
