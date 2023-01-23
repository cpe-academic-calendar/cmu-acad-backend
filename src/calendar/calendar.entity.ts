import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ColumnTypeUndefinedError, DeleteDateColumn} from 'typeorm'

@Entity()
export class Calendar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    start_semester: string;

    @Column()
    date_semester: number;

    @Column()
    calendar_status: string;
    
    @CreateDateColumn()
    create_at: Date;

    @CreateDateColumn()
    update_at: Date;

    @DeleteDateColumn()
    delete_at: Date;
}