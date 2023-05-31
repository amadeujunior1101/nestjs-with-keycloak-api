import { User } from 'src/Domain/user';
import { UserModel } from './entities/user.entity';

export interface IUserModelFactory {
  toModel(user: User): UserModel;
  toEntity(model: UserModel): User;
}
