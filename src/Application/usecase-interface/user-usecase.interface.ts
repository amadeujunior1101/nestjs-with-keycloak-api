import { UserModel } from 'src/Infra/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserUsecase {
  executeCreate?(user: CreateUserDto): Promise<UserModel>;
  executeList?(): Promise<UserModel[]>;
  executeGetById?(id: string, token: string): Promise<UserModel>;
}
