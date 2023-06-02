import { HttpException } from '@nestjs/common';
import { UserModel } from 'src/Infra/entities/user.entity';
import RoleValidator from 'src/gateways/clients/utils/users/token.validate';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUserUsecase } from '../usecase-interface/user-usecase.interface';

export class GetUserByIdUsecase implements IUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}
  async executeGetById(id: string, token: string): Promise<UserModel> {
    const userId = RoleValidator.execResourceWithUserId(token, ['user']);
    if (id !== userId) throw new HttpException('Forbidden resource', 403);
    const user = await this.userRepository.getById(id);
    return user;
  }
}
