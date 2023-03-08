import { EventType } from 'src/asset/enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,  ManyToOne, JoinColumn } from 'typeorm'
import { Calendar } from '../calendar/calendar.entity';


@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_name: string;
     @Column()
    isOveride: boolean
    @Column()
    type: string

    @Column({
        default: "#352829"
    })
    color: string
    
    @Column({
        default: null
    })
    ref_start: string

    @Column({
        default: null
    })
    ref_end: string

    @CreateDateColumn({
        default: null
    })
    start_date: Date

    @CreateDateColumn({
        default: null
    })
    end_date: Date

    @Column({
        default: null
    })
    num_weeks: number

    @Column({
        default: null
    })
    num_days: number

    @Column({
        default: null
    })
    duration_weeks: number

    @Column({
        default: null
    })
    duration_days: number

    @ManyToOne(() =>  Event)
    reference_event: Event

    @ManyToOne(() =>  Event)
    reference_condition: Event
    
    @ManyToOne(() => Calendar, calendar => calendar.events, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'calendarId'})
    calendar: Calendar;
}