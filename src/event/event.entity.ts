import { EventType } from 'src/asset/enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,  ManyToOne } from 'typeorm'
import { Calendar } from '../calendar/calendar.entity';


@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_name: string;
<<<<<<< HEAD

    @Column()
    type: string
=======

    @Column({
        type: 'enum',
        enum: EventType,
    })
    type: EventType

<<<<<<< HEAD
    @CreateDateColumn()
    date: Date;
>>>>>>> f478532 (feat: auto-gen)
=======
    @Column({
        default: null
    })
    date: string;
>>>>>>> c0660fe (feat: generate holiday)

    @Column({
        default: "#352829"
    })
    color: string
<<<<<<< HEAD
=======

    @Column({
        default: null
    })
>>>>>>> f478532 (feat: auto-gen)
    
    @Column({
        default: null
    })
<<<<<<< HEAD
    ref_start: string
=======
    ref_start: String
>>>>>>> f478532 (feat: auto-gen)

    @Column({
        default: null
    })
    ref_end: String

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
    
    @ManyToOne(type => Calendar, calendar => calendar.events)
    calendar: Calendar;
}