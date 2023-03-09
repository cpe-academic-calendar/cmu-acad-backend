import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CMU ACAD API')
    .setDescription('This is Api for chiangmai academic calendar web application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api',app,document)
  await app.enableCors()
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
