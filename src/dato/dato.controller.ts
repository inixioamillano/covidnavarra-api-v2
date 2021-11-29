import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DatoService } from './dato.service';
import { CreateDatoDto } from './dto/create-dato.dto';
import { UpdateDatoDto } from './dto/update-dato.dto';

@Controller('dato')
export class DatoController {
  constructor(private readonly datoService: DatoService) {}

  @Get()
  findAll(@Query('codZR') codZR: number) {
    return this.datoService.getDatos(codZR);
  }

}
