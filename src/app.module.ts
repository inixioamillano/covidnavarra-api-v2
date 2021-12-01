import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatoModule } from './dato/dato.module';
import { Dato } from './dato/entities/dato.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CsvModule } from 'nest-csv-parser';
import { HttpModule } from '@nestjs/axios';
import { ZonaModule } from './zona/zona.module';
import { Zona } from './zona/entities/zona.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.65.70.32',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'covid_por_municipios',
      entities: [Dato, Zona],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    CsvModule,
    HttpModule,
    DatoModule,
    ZonaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
