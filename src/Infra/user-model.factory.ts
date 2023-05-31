import { User } from 'src/Domain/user';
import { UserModel } from './entities/user.entity';

export class UserModelFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public toModel(entity: Partial<User> & Pick<User, 'id'>): UserModel {
    return new UserModel({
      id: entity.id,
      name: entity.name,
      email: entity.email,
    });
  }

  public toEntity(model: Partial<UserModel> & Pick<UserModel, 'id'>): User {
    const user = new User({
      id: model.id,
      name: model.name,
      email: model.email,
    });

    return user;
  }
}
