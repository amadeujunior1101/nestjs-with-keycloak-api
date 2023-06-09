import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import { CreateUserDto } from 'src/Application/dto/create-user.dto';
import { IUserUsecase } from 'src/Application/usecase-interface/user-usecase.interface';
import { CreateUserInterceptor } from 'src/gateways/clients/utils/users/create/createUser.interceptor';
import RoleValidator from 'src/gateways/clients/utils/users/token.validate';
import { UserModel } from './entities/user.entity';
import { KeycloakAPI } from './integrations/KeycloakAPI';

@Controller('user')
export class UserController {
  constructor(
    @Inject('ICreateUserUsecase')
    private readonly createUserUsecase: IUserUsecase,
    @Inject('ListAllUserUsecase')
    private readonly listUserUsecase: IUserUsecase,
    @Inject('GetByIdUserUsecase')
    private readonly userByIdUserUsecase: IUserUsecase,
    private readonly keycloak: KeycloakAPI,
  ) {}

  @Post()
  @Roles({
    roles: ['admin'],
  })
  @UseInterceptors(CreateUserInterceptor)
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    RoleValidator.execResource(req.accessTokenJWT, ['admin']);

    await this.keycloak.checkUser(createUserDto.email);
    return this.createUserUsecase.executeCreate(createUserDto);
  }

  @Get()
  @Roles({
    roles: ['admin'],
  })
  async listAll(): Promise<UserModel[]> {
    return this.listUserUsecase.executeList();
  }

  @Get(':id')
  @Roles({
    roles: ['user'],
  })
  async getById(@Param('id') id: string, @Request() req): Promise<UserModel> {
    return this.userByIdUserUsecase.executeGetById(id, req.accessTokenJWT);
  }
}
