import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ColumnTypeUndefinedError, DeleteDateColumn, OneToMany} from 'typeorm'
import { Event } from '../event/event.entity';

@Entity()
export class Calendar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    start_semester: Date;

    @Column()
    year: number;

    @Column()
    calendar_status: string;
    
    @CreateDateColumn()
    create_at: Date;

    @CreateDateColumn()
    update_at: Date;

    @DeleteDateColumn()
    delete_at: Date;

    @OneToMany(() => Event, events => events.calendar)
    events : Event[]
}