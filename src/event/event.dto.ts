import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Calendar } from "src/calendar/calendar.entity";

export class EventDto {
    @ApiProperty({required: false})
    event_name: string;

    @ApiProperty({required: false})
    color: string;

    @ApiProperty({required: false})
    reference_event: number;

    @ApiProperty({required: false})
    start_date: Date;

    @ApiProperty({required: false})
    duration_start: number;

    @ApiProperty({required: false})
    num_week: number;

    @ApiProperty({required: false})
    num_days: number;

    @ApiProperty({required: false})
    end_date: Date;

    @ApiProperty({required: false})
    duration_end: number;

    @ApiProperty({required: false})
    num_weekEnd: number;

    @ApiProperty({required: false})
    num_daysEnd: number;

    @ApiProperty({required: false})
    type: string;

    @ApiProperty({required: false})
    calendar: Calendar
}

export class UpdateEventDto {
    @ApiProperty({required: false})
    event_name: string;

    @ApiProperty({required: false})
    type: string;

    @ApiProperty({required: false})
    start_date: Date;

    @ApiProperty({required: false})
    end_datte: Date;


    @ApiProperty({required: false})
    color: string
}

export class QueryEventDto{
    @ApiProperty()
    id: number
}
