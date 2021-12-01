import { Module } from '@nestjs/common';
import { ZonaService } from './zona.service';
import { ZonaController } from './zona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zona, ZonaSchema } from './entities/zona.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Zona.name, schema: ZonaSchema}
    ])
  ],
  controllers: [ZonaController],
  providers: [ZonaService]
})
export class ZonaModule {}
