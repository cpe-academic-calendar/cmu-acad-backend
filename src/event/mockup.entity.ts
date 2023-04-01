import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'


@Entity()
export class MockUpEvent {

    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    event_name: string;

    @ApiProperty()
    @Column()
    type: string

    @ApiProperty()
    @Column({
        default: null
    })
    color: string

    @ApiProperty()
    @CreateDateColumn({
        default: null
    })
    start_date: Date

    @ApiProperty()
    @Column({
        default:  false
    })
    isNextYear:  boolean

}