import { BadRequestException } from '@nestjs/common';

export class User {
  id: string;
  name: string;
  email: string;

  constructor(user: { id: string; name: string; email: string }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }

  public nameNotEmpty() {
    console.log('here name', this.name);
    if (this.name === '') throw new BadRequestException('name not empty');
  }
}
