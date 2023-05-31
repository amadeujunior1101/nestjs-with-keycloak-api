import { CreateUserDto } from 'src/Application/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user';

export class UserFactory {
  createUser(data: CreateUserDto): User {
    const user = new User({ id: uuidv4(), name: data.name, email: data.email });

    user.nameNotEmpty();

    return user;
  }
}
