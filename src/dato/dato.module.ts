import { Module } from '@nestjs/common';
import { DatoService } from './dato.service';
import { DatoController } from './dato.controller';
import { Dato, DatoSchema } from './entities/dato.entity';
import { CsvModule } from 'nest-csv-parser';
import { HttpModule } from '@nestjs/axios';
import { Zona, ZonaSchema } from 'src/zona/entities/zona.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Dato.name, schema: DatoSchema}, {name: Zona.name, schema: ZonaSchema}]),
    CsvModule,
    HttpModule
  ],
  controllers: [DatoController],
  providers: [DatoService]
})
export class DatoModule {}
