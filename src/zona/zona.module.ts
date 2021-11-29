import { Module } from '@nestjs/common';
import { ZonaService } from './zona.service';
import { ZonaController } from './zona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ZONAS from './data/zonas';
import { Zona } from './entities/zona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zona])],
  controllers: [ZonaController],
  providers: [ZonaService]
})
export class ZonaModule {}
