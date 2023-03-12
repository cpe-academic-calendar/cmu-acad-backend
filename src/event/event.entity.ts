import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm'
import { Calendar } from '../calendar/calendar.entity';


@Entity()
export class Event {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    event_name: string;

    @ApiProperty()
    @Column()
    isOveride: boolean

    @ApiProperty()
    @Column()
    type: string

    @ApiProperty()
    @Column({
        default: "#352829"
    })
    color: string

    @ApiProperty()
    @Column({
        default: null
    })
    ref_start: string

    @ApiProperty()
    @Column({
        default: null
    })
    ref_end: string

    @ApiProperty()
    @CreateDateColumn({
        default: null
    })
    start_date: Date

    @ApiProperty()
    @CreateDateColumn({
        default: null
    })
    end_date: Date

    @ApiProperty()
    @Column({
        default: null
    })
    num_weeks: number

    @ApiProperty()
    @Column({
        default: null
    })
    num_days: number

    @ApiProperty()
    @Column({
        default: null
    })
    duration_weeks: number

    @ApiProperty()
    @Column({
        default: null
    })
    duration_days: number

    @ApiProperty()
    @Column({
        default:  false
    })
    isAffair:  boolean

    @ApiProperty({ type: () => Event })
    @ManyToOne(() => Event)
    reference_event: Event

    @ApiProperty({ type: () => Event })
    @ManyToOne(() => Event)
    reference_condition: Event

    @ApiProperty({ type: () => Calendar })
    @ManyToOne(() => Calendar, calendar => calendar.events,{ onDelete: 'SET NULL' })
    calendar: Calendar;
}