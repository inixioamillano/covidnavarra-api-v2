import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(["Fecha", "CodZR", "CodMun"], { unique: true })
export class Dato {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    Fecha: Date;

    @Column({nullable: true})
    CodZR: number;

    @Column({nullable: true})
    DesZR: string;

    @Column({nullable: true})
    CodMun: number;

    @Column({nullable: true})
    DesMun: string;

    @Column({nullable: true})
    NuevosCasos: number;

    @Column({nullable: true})
    AcumuladoCasosHastaLaFecha: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
}
