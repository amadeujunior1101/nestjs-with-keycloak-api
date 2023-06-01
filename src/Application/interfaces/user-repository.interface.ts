import { User } from 'src/Domain/user';
import { UserModel } from 'src/Infra/entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<UserModel>;
  listAll(): Promise<UserModel[]>;
  getById(id: string): Promise<UserModel>;
}
