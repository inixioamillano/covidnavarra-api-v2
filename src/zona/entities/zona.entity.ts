import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Zona extends Document {
    
    @Prop({nullable: false})
    CodZR: number;

    @Prop({nullable: false})
    DesZR: string;

    @Prop({nullable: false})
    habitantes: number;

}


export const ZonaSchema = SchemaFactory.createForClass(Zona);
