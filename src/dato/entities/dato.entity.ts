import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Dato extends Document {
    
    @Prop({nullable: true})
    Fecha: Date;

    @Prop({nullable: true})
    CodZR: number;

    @Prop({nullable: true})
    DesZR: string;

    @Prop({nullable: true})
    CodMun: number;

    @Prop({nullable: true})
    DesMun: string;

    @Prop({nullable: true})
    NuevosCasos: number;

    @Prop({nullable: true})
    AcumuladoCasosHastaLaFecha: number;

}


export const DatoSchema = SchemaFactory.createForClass(Dato);