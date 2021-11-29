import { Module } from '@nestjs/common';
import { DatoService } from './dato.service';
import { DatoController } from './dato.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dato } from './entities/dato.entity';
import { CsvModule } from 'nest-csv-parser';
import { HttpModule } from '@nestjs/axios';
import { Zona } from 'src/zona/entities/zona.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dato, Zona]),
    CsvModule,
    HttpModule
  ],
  controllers: [DatoController],
  providers: [DatoService]
})
export class DatoModule {}
