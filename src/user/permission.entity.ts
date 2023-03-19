import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm'


@Entity()
export class Permission {
    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    _id: Number
    
    @ApiProperty()
    @Column()
    calendar_id: number

    @ApiProperty()
    @Column('simple-array', { nullable: true })
    user_id: number[] 
}