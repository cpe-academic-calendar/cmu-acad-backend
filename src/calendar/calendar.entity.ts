import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ColumnTypeUndefinedError, DeleteDateColumn} from 'typeorm'

@Entity()
export class Calendar {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    semester: number;

    @Column()
    calendar_status: string;
    
    @CreateDateColumn()
    create_at: Date;

    @CreateDateColumn()
    update_at: Date;

    @DeleteDateColumn()
    delete_at: Date;
}