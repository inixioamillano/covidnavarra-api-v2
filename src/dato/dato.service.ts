import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CsvParser } from 'nest-csv-parser';
import { take } from 'rxjs';
import { Zona } from '../zona/entities/zona.entity';
import { Not, Repository } from 'typeorm';
import { Dato } from './entities/dato.entity';
const fs = require("fs");

@Injectable()
export class DatoService {

  constructor(
    @InjectRepository(Dato) private datosRepositorio: Repository<Dato>,
    @InjectRepository(Zona) private zonasRepositorio: Repository<Zona>,
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
          const datos = await this.csvParser.parse(stream, Dato);
          datos.list.forEach((async dato => {
            await this.datosRepositorio.createQueryBuilder()
              .insert()
              .into(Dato)
              .values(dato)
              .execute()
              .catch(e => e);
            const { Fecha, CodZR, CodMun, DesZR, DesMun } = dato;
            await this.datosRepositorio.update({
                Fecha,
                CodZR,
                CodMun,
                DesZR,
                DesMun,
                NuevosCasos: Not(dato.NuevosCasos)
              }, dato)
              .catch(e => e);
          }))
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
    const datos = await this.datosRepositorio.manager.query(`select selected_date as Fecha, IFNULL(sum(dato.NuevosCasos),0) as NuevosCasos, max(createdAt) as updatedAt from 
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
    return {datos: conIA, desglose: await this.getDesglose(CodZR)}
  }

  async getDesglose(CodZR: number) {
    return this.datosRepositorio.query(`select DesMun, sum(NuevosCasos) as NuevosCasos from dato where Fecha = (select max(Fecha) from dato) ${CodZR ? `and CodZR = ${CodZR}` : ''} group by DesMun order by NuevosCasos desc, DesMun`)
  }

}
