import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ColumnTypeUndefinedError, DeleteDateColumn, OneToMany} from 'typeorm'
import { Event } from '../event/event.entity';

@Entity()
export class Calendar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    start_semester: string;

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

    @OneToMany(type => Event, events => events.calendar)
    events : Event[]
}