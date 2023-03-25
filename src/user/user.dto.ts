import { ApiProperty } from "@nestjs/swagger"
import e from "express"

export class UserDto {
    @ApiProperty({required: false})
    _id: Number

    @ApiProperty({required: false})
    prename_id: String

    @ApiProperty({required: false})
    firstname_TH: String

    @ApiProperty({required: false})
    lastname_TH: String

    @ApiProperty({required: false})
    firstname_EN: String

    @ApiProperty({required: false})
    lastname_EN: String

    @ApiProperty({required: false})
    itaccounttype_id: String

    @ApiProperty({required: false})
    cmuitaccount: string

    @ApiProperty({required: false})
    role: String
}

export class UserIdDto{
    @ApiProperty()
    _id: Number
}

export class QueryUserDto{
    @ApiProperty()
    cmuitaccount: string
}

export class SetRoleDto{
    @ApiProperty()
    role: string
}