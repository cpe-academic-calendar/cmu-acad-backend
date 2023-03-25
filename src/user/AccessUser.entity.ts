import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class AccessUser {
    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: Number

    @ApiProperty()
    @Column()
    cmuitaccount: string

}