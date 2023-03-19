import { ApiProperty, PartialType } from "@nestjs/swagger";

export class EventDto {
    @ApiProperty()
    event_name: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    color: string;

    @ApiProperty()
    reference_event: number;

    @ApiProperty()
    start_date: Date;

    @ApiProperty()
    duration_start: number;

    @ApiProperty()
    num_week: number;

    @ApiProperty()
    num_days: number;

    @ApiProperty()
    end_date: Date;

    @ApiProperty()
    duration_end: number;

    @ApiProperty()
    num_weekEnd: number;

    @ApiProperty()
    num_daysEnd: number;
}

export class UpdateEventDto {
    
    @ApiProperty()
    event_name: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    start_date: Date;

    @ApiProperty()
    color: string

    @ApiProperty()
    date: string;

}
