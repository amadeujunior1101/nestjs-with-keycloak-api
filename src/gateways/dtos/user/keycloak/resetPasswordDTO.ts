import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPassword {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(props) {
    Object.assign(this, props);
  }
}
