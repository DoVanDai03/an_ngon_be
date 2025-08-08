import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminSeeder } from './admin/admin.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Run admin seeder
  const adminSeeder = app.get(AdminSeeder);
  await adminSeeder.seed();

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on: http://localhost:${port}`);
}
bootstrap();