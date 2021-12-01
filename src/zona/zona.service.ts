import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ZONAS from './data/zonas';
import { Zona } from './entities/zona.entity';

@Injectable()
export class ZonaService {

  constructor(@InjectModel(Zona.name) private zonasModel: Model<Zona>){
    this.populate();
  }

  async findAll() {
    console.log('Llego aqui');
    return await this.zonasModel.find({}).sort({DesZR: 'ASC'}).exec();
  }

  private async populate() {
    const total = await this.zonasModel.count();
    console.log('Zonas', total)
    if (total < ZONAS.length) {
      await this.zonasModel.deleteMany({});
      this.zonasModel.insertMany(ZONAS);
    }
  }

}
