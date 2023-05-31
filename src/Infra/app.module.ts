import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { IUserRepository } from 'src/Application/interfaces/user-repository.interface';
import { CreateUserUsecase } from 'src/Application/usecases/create-user.usecase';
import { ListAllUserUsecase } from 'src/Application/usecases/list-all-user.usecase';
import { UserFactory } from 'src/Domain/user-factory';
import { Repository } from 'typeorm';
import { DatabaseModule } from './database.module';
import { UserModel } from './entities/user.entity';
import { IUserModelFactory } from './user-model-factory.interface';
import { UserModelFactory } from './user-model.factory';
import { UserRepository } from './user-repository';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'ICreateUserUsecase',
      useExisting: CreateUserUsecase,
    },
    {
      provide: 'ListAllUserUsecase',
      useExisting: ListAllUserUsecase,
    },
    {
      provide: UserModelFactory,
      useExisting: UserModelFactory,
    },
    {
      provide: UserRepository,
      useFactory: (
        userRepository: Repository<UserModel>,
        userModelFactory: IUserModelFactory,
      ) => {
        return new UserRepository(userRepository, userModelFactory);
      },
      inject: [getRepositoryToken(UserModel), UserModelFactory],
    },
    UserModelFactory,
    UserFactory,
    {
      provide: CreateUserUsecase,
      useFactory: (repository: IUserRepository, userFactory: UserFactory) => {
        return new CreateUserUsecase(repository, userFactory);
      },
      inject: [UserRepository, UserFactory],
    },
    {
      provide: ListAllUserUsecase,
      useFactory: (repository: IUserRepository) => {
        return new ListAllUserUsecase(repository);
      },
      inject: [UserRepository],
    },
  ],
})
export class AppModule {}
