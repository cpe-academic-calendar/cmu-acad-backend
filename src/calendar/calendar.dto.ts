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

export class UpdateCalendarDto extends PartialType(CalendarDto){}