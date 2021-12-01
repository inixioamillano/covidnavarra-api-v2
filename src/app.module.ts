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
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    /*TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://CovidAdmin:covidbpassword@cluster0.g97xs.mongodb.net/covid-data-nest?retryWrites=true',
      database: 'covid_por_municipios',
      entities: [Dato, Zona],
      synchronize: true,
      useUnifiedTopology: true
    }),*/
    MongooseModule.forRoot('mongodb+srv://CovidAdmin:covidbpassword@cluster0.g97xs.mongodb.net/covid_por_municipios?retryWrites=true'),
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
