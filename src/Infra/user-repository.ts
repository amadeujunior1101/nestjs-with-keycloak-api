import { IUserRepository } from 'src/Application/interfaces/user-repository.interface';
import { User } from 'src/Domain/user';
import { ExceptionWithCode } from 'src/utils/exception-with-code';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { IUserModelFactory } from './user-model-factory.interface';

export class UserRepository implements IUserRepository {
  constructor(
    private readonly userRepository: Repository<UserModel>,
    private userModelFactory: IUserModelFactory,
  ) {}
  async create(data: User): Promise<UserModel> {
    const userModel = this.userModelFactory.toModel(data);
    const user = await this.userRepository.save(userModel);
    return user;
  }

  async listAll(): Promise<UserModel[]> {
    const users = await this.userRepository.find();
    const userModels: UserModel[] = users.map((user) =>
      this.userModelFactory.toEntity(user),
    );
    return userModels;
  }

  async getById(id: string): Promise<UserModel> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new ExceptionWithCode('User not found', 404, 'US1', 'US3');

    const userModel = this.userModelFactory.toEntity(user);
    return userModel;
  }
}
