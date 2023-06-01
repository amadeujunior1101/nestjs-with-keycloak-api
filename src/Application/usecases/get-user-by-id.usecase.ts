import { UserModel } from 'src/Infra/entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUserUsecase } from '../usecase-interface/user-usecase.interface';

export class GetUserByIdUsecase implements IUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}
  async executeGetById(id: string): Promise<UserModel> {
    const user = await this.userRepository.getById(id);
    return user;
  }
}
