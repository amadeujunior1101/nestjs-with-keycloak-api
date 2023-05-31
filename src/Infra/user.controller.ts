import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/Application/dto/create-user.dto';
import { IUserUsecase } from 'src/Application/usecase-interface/user-usecase.interface';
import { UserModel } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(
    @Inject('ICreateUserUsecase')
    private readonly createUserUsecase: IUserUsecase,
    @Inject('ListAllUserUsecase')
    private readonly listUserUsecase: IUserUsecase,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    return this.createUserUsecase.executeCreate(createUserDto);
  }

  @Get()
  async listAll(): Promise<UserModel[]> {
    return this.listUserUsecase.executeList();
  }
}
