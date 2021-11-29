import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ZONAS from './data/zonas';
import { Zona } from './entities/zona.entity';

@Injectable()
export class ZonaService {

  constructor(@InjectRepository(Zona) private zonasRepository: Repository<Zona>){
    this.populate();
  }

  findAll() {
    return this.zonasRepository.find({
      order: {
        DesZR: 'ASC'
      }
    });
  }

  private async populate() {
    const total = await this.zonasRepository.count();
    if (total < ZONAS.length) {
      await this.zonasRepository.delete({});
      this.zonasRepository.save(ZONAS);
    }
  }

}
