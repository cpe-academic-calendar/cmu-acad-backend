import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ColumnTypeUndefinedError, DeleteDateColumn, ManyToOne, OneToOne} from 'typeorm'
import { Calendar } from '../calendar/calendar.entity';
import { EventType } from './enum';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_name: string;
    
    @Column({
        type: 'enum',
        enum: EventType,
    })
    type: EventType

    @Column()
    date: Date;

    @Column({
        default: "#352829"
    })
    color: string

    // @OneToOne(type => Event, refdate => refdate.id)
    // ref_date: number
    
    @ManyToOne(type  => Calendar, calendar => calendar.events)
    calendar: Calendar;
}