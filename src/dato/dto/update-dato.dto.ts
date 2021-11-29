import { PartialType } from '@nestjs/mapped-types';
import { CreateDatoDto } from './create-dato.dto';

export class UpdateDatoDto extends PartialType(CreateDatoDto) {}
