import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { IUserRepository } from 'src/Application/interfaces/user-repository.interface';
import { CreateUserUsecase } from 'src/Application/usecases/create-user.usecase';
import { GetUserByIdUsecase } from 'src/Application/usecases/get-user-by-id.usecase';
import { ListAllUserUsecase } from 'src/Application/usecases/list-all-user.usecase';
import { UserFactory } from 'src/Domain/user-factory';
import { ApplicationConfigModule } from 'src/gateways/clients/config/application-config.module';
import { UserGatewayModule } from 'src/gateways/clients/user/user.gateway.module';
import { Repository } from 'typeorm';
import { DatabaseModule } from './database.module';
import { UserModel } from './entities/user.entity';
import { IUserModelFactory } from './user-model-factory.interface';
import { UserModelFactory } from './user-model.factory';
import { UserRepository } from './user-repository';
import { UserController } from './user.controller';

@Module({
  imports: [
    ApplicationConfigModule,
    TypeOrmModule.forFeature([UserModel]),
    DatabaseModule,
    UserGatewayModule,
  ],
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
      provide: 'GetByIdUserUsecase',
      useExisting: GetUserByIdUsecase,
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
    {
      provide: GetUserByIdUsecase,
      useFactory: (repository: IUserRepository) => {
        return new GetUserByIdUsecase(repository);
      },
      inject: [UserRepository],
    },
    // {
    //   provide: KeycloakAPI,
    //   useFactory: (configService: ConfigService) => {
    //     const url = configService.get('BASE_URL');
    //     const realm = configService.get('REALM');
    //     return new KeycloakAPI(url, realm);
    //   },
    //   inject: [ConfigService],
    // },
  ],
})
export class AppModule {}
