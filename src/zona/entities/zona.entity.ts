import { Column, Entity } from "typeorm";

@Entity()
export class Zona {
    
    @Column({primary: true})
    CodZR: number;

    @Column({nullable: false})
    DesZR: string;

    @Column({nullable: false})
    habitantes: number;

}
