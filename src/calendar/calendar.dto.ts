import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateCalendarDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    year: number;
    
    @ApiProperty()
    calendar_status: string;
    
    @ApiProperty()
    start_semester:  Date;
    
    @ApiProperty()
    create_at: Date;
    
    @ApiProperty()
    update_at: Date;
}

export class CalendarDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    name:string;
    
    @ApiProperty()
    year: number;
    
    @ApiProperty()
    calendar_status: string;
    
    @ApiProperty()
    start_semester:  Date;
}

export class QueryCalendarDto{
    @ApiProperty()
    id: number

    @ApiProperty({required: false})
    name: String
}

export class CreateNewCalendarDto{
    @ApiProperty()
    start_semester: Date;
}
