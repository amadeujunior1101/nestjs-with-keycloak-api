import { NestFactory } from '@nestjs/core';
import { AppModule } from './Infra/app.module';
import { AllExceptionsFilter } from './Infra/shared/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
