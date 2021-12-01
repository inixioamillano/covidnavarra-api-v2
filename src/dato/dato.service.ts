import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Model } from 'mongoose';
import { CsvParser } from 'nest-csv-parser';
import { take } from 'rxjs';
import { Zona } from 'src/zona/entities/zona.entity';
import { Dato } from './entities/dato.entity';
const fs = require("fs");

@Injectable()
export class DatoService {

  constructor(
    @InjectModel(Dato.name) private datos: Model<Dato>,
    @InjectModel(Zona.name) private zonas: Model<Zona>,
    private readonly csvParser: CsvParser,
    private readonly httpService: HttpService) {
      this.loadNewData();
    }

  @Cron(CronExpression.EVERY_5_MINUTES)
  loadNewData() {
    this.httpService.get('https://www.navarra.es/appsext/DescargarFichero/default.aspx?codigoAcceso=OpenData&fichero=coronavirus\\CasosMunicipios_ZR_Covid.csv')
      .pipe(take(1))
      .subscribe({
        next: async (csv) => {
          fs.writeFileSync(__dirname + '/datos.csv', csv.data);
          const stream = fs.createReadStream(__dirname + '/datos.csv')
          try {
            const datos = await this.csvParser.parse(stream, Dato, null, null, {strict: false});
            datos.list.forEach((d) => {
              this.datos.create(d).catch(e => e);
            });
          } catch(e) {
            console.log(e);
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  private getIA14(datos: Dato[], from: number, habitantes: number) {
    const data = datos.slice(Math.max(0, from - 13), from + 1);
    return data.reduce((p, c) => p + parseInt(`${c.NuevosCasos}`), 0)*100000/habitantes;
  }

  private getAcumulados(datos: Dato[], index: number) {
    const data = datos.slice(0, index + 1);
    return data.reduce((p, c) => p + parseInt(`${c.NuevosCasos}`), 0)
  }

  async getDatos(CodZR: number) {
    /*const datos = await this.datos.query(`select selected_date as Fecha, IFNULL(sum(dato.NuevosCasos),0) as NuevosCasos, max(createdAt) as updatedAt from 
    (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
     (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
     (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
     (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
     (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
     (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
    left outer join dato
    on dato.Fecha = selected_date 
    ${CodZR ? `and dato.CodZR = ${CodZR}` : ''}
    where selected_date between '2020-03-13' and (select max(date_format(Fecha, '%Y-%m-%d')) from dato)
    group by selected_date
    order by selected_date;`);
    let habitantes = 646430;
    if (CodZR) {
      const zona = await this.zonasRepositorio.findOne({CodZR});
      if (zona) {
        habitantes = zona.habitantes;
      }
    }
    const conIA = datos.map((d, index) => {
      return {...d, ia14: this.getIA14(datos, index, habitantes), AcumuladoCasosHastaLaFecha: this.getAcumulados(datos, index)};
    })
    return {datos: conIA, desglose: await this.getDesglose(CodZR)}*/
  }

  async getDesglose(CodZR: number) {
    //return this.datos.query(`select DesMun, sum(NuevosCasos) as NuevosCasos from dato where Fecha = (select max(Fecha) from dato) ${CodZR ? `and CodZR = ${CodZR}` : ''} group by DesMun order by NuevosCasos desc, DesMun`)
  }

}
