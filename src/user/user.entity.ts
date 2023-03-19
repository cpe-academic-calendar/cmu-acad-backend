import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class User {
    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    _id: Number
    
    @ApiProperty()
    @Column()
    prename_id: String


    @ApiProperty()
    @Column()
    firstname_TH: String

    @ApiProperty()
    @Column()
    lastname_TH: String
    
    @ApiProperty()
    @Column()
    firstname_EN: String

    @ApiProperty()
    @Column()
    lastname_EN: String

    @ApiProperty()
    @Column()
    itaccounttype_id: String

    @ApiProperty()
    @Column()
    role: String
}