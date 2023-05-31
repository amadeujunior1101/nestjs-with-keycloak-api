import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: 'database.sqlite',
          entities: [UserModel],
          synchronize: true,
          dropSchema: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
