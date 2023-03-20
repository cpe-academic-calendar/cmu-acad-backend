import { ApiProperty } from '@nestjs/swagger';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany, JoinColumn} from 'typeorm'
import { Event } from '../event/event.entity';

@Entity()
export class Calendar {
    @ApiProperty()
    @Column()
    user_id: number;

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @CreateDateColumn()
    start_semester: Date;


    @ApiProperty()
    @Column()
    year: number;


    @ApiProperty()
    @Column({default: 'Active'})
    calendar_status: string;

    @ApiProperty()
    @CreateDateColumn()
    create_at: Date;

    @ApiProperty()
    @CreateDateColumn()
    update_at: Date;

    @ApiProperty()
    @DeleteDateColumn()
    delete_at: Date;
    
    @ApiProperty({ type: () => Event })
    @OneToMany(() => Event, events => events.calendar,{ onDelete: 'SET NULL' })
    @JoinColumn()
    events : Event[]
}