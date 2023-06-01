import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRefreshDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  constructor(props) {
    Object.assign(this, props);
  }
}
