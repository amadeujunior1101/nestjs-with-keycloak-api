import { UserFactory } from 'src/Domain/user-factory';
import { UserModel } from 'src/Infra/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUserUsecase } from '../usecase-interface/user-usecase.interface';

export class CreateUserUsecase implements IUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async executeCreate(data: CreateUserDto): Promise<UserModel> {
    const user = this.userFactory.createUser(data);
    await this.userRepository.create(user);

    return user;
  }
}
