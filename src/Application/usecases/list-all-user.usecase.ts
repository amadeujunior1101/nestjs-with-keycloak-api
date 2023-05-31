import { UserModel } from 'src/Infra/entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUserUsecase } from '../usecase-interface/user-usecase.interface';

export class ListAllUserUsecase implements IUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}
  async executeList(): Promise<UserModel[]> {
    return await this.userRepository.listAll();
  }
}
