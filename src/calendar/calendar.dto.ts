export class CreateCalendarDto {
    name: string;
    year: number;
    calendar_status: string;
    start_semester:  Date;
    create_at: Date;
    update_at: Date;
}

export class CalendarDto {
    name:string;
    year: number;
    calendar_status: string;
    start_semester:  Date;

}