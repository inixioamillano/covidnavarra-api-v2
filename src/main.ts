import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const crPath = '/etc/letsencrypt/live/covidnavarraapi.inixio.dev/fullchain.pem';
const pkPath = '/etc/letsencrypt/live/covidnavarraapi.inixio.dev/privkey.pem';
const options: any = {};

import * as fs from 'fs';

if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
  options.httpsOptions = {
    cert: fs.readFileSync(crPath),
    key: fs.readFileSync(pkPath)
  }
}

async function bootstrap() {
  // le pasamos las options al NestFactory
  const app = await NestFactory.create(AppModule, options);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
