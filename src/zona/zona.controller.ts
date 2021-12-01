import { Controller, Get } from '@nestjs/common';
import { ZonaService } from './zona.service';

@Controller('zona')
export class ZonaController {
  constructor(private readonly zonaService: ZonaService) {}

  @Get()
  findAll() {
    return this.zonaService.findAll();
  }

}
