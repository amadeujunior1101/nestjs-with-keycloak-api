import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassword {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description:
      'Senha de usuário, deve conter no mínimo 6 caracteres, sendo pelo menos 1 ou mais letras maiúsculas, 1 ou mais letras minúsculas e 1 ou mais números e 1 ou mais simbolos',
    maxLength: 128,
    example: 'Ra479@#',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Confirmação da senha do morador',
    example: 'Ra479@#',
    maxLength: 128,
  })
  passwordConfirmation: string;

  constructor(props) {
    Object.assign(this, props);
  }
}
