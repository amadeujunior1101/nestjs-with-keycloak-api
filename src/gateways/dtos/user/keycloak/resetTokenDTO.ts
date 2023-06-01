import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class resetTokenDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Token',
    example:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGltZSIsImVtYWlsIjoidGVzdGdhYnJpZWx0ZWFtQGdtYWlsLmNvbSIsImlhdCI6MTY2MzYwOTUxOH0.hxspNA7u4MAGfYEZMJRQrABEYvt-HGY95KBqJU4E4YZPLIjGmptJbEfQFIZU8E9pDMjmYjXA5jyCK1oKarUcGw',
  })
  token: string;

  constructor(props: resetTokenDTO) {
    Object.assign(this, props);
  }
}
