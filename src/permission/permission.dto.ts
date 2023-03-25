import { ApiProperty, PartialType } from "@nestjs/swagger";

export class PermissionDto {
    @ApiProperty()
    id: number 
    
    @ApiProperty()
    cmuitaccount: string
}


export class CreatePermissionDto {
    @ApiProperty({required: false})
    cmuitaccount: string
}

export class RemovePermissionDto  {
    @ApiProperty()
    id: number
}
