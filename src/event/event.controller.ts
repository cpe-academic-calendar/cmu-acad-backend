import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../event/event.entity'
import *  as fs from 'fs'
import { UpdateEventDto } from './event.dto';


@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Get('/')
    async findAll() {
        return await this.eventService.findAll();
    }

    @Post('/create')
    async createEvent(@Body() event: Event) {
        const newEvent = new Event()
        newEvent.event_name = event.event_name
        newEvent.type = event.type
        newEvent.calendar = event.calendar
        newEvent.start_date = event.start_date
        return await this.eventService.createEvent(newEvent)
    }

    @Post('/auto-gen')
    async autoGenerate(@Body('start_semester') start_semester) {
        const arr = []
        const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        const event = JSON.parse(dataEvent)
        event[0].start_date = start_semester
        for (let i in event) {
            if (event[i].reference_event) {
                if (event[i].ref_start == 'before') {
                    const index = event[i].reference_event
                    const con_index = event[i].reference_condition
                    if (event[i].ref_end == 'after-last') {
                        const month = new Date(event[index - 1].start_date).getMonth()
                        const year = new Date(event[index - 1].start_date).getFullYear()
                        const date = new Date(event[index - 1].start_date).getDate() - (event[i].num_weeks * 7 + event[i].num_days)
                        const start = new Date(year, month, date)
                        const end_month = new Date(event[con_index - 1].start_date).getMonth()
                        const end_year = new Date(event[con_index - 1].start_date).getFullYear()
                        const end_date = new Date(event[con_index - 1].start_date).getDate() - (event[i].num_weeks * 7 + event[i].num_days)
                        const last = new Date(end_year,end_month,end_date)
                        event[i].start_date = start
                        event[i].end_date = last
                    }
                    if  (event[i].ref_end == 'before'){
                        
                    }
                        const month = new Date(event[index - 1].start_date).getMonth()
                        const year = new Date(event[index - 1].start_date).getFullYear()
                        const date = new Date(event[index - 1].start_date).getDate() - (event[i].num_weeks * 7 + event[i].num_days)
                        const start = new Date(year, month, date)
                        const last_date = new Date(start).getDate() + (event[i].duration_days + event[i].duration_weeks * 7)
                        const last = new Date(new Date(start).setDate(last_date))
                        event[i].start_date = start
                        event[i].end_date = last
                }

                if (event[i].ref_start == 'after') {
                    const index = event[i].reference_event
                    const month = new Date(event[index - 1].start_date).getMonth()
                    const year = new Date(event[index - 1].start_date).getFullYear()
                    const date = new Date(event[index - 1].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days)
                    const last_date = new Date(event[index - 1].start_date).getDate() + (event[i].duration_days + event[i].duration_weeks * 7)
                    const start = new Date(year, month, date)
                    const last = new Date(new Date(start).setDate(last_date))
                    event[i].start_date = start
                    event[i].end_date = last
                }

                if (event[i].ref_start == 'after-last') {
                    const index = event[i].reference_event
                    const month = new Date(event[index - 1].end_date).getMonth()
                    const year = new Date(event[index - 1].end_date).getFullYear()
                    const date = new Date(event[index - 1].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days)
                    const last_date = new Date(event[index - 1].end_date).getDate() + (event[i].duration_days + event[i].duration_weeks * 7)
                    const start = new Date(year, month, date)
                    const last = new Date(new Date(start).setDate(last_date))
                    event[i].start_date = start
                    event[i].end_date = last
                }
            }
        }
        console.log(event)


    }

    @Get('/find/:id')
    async findEvent(@Param() id: number) {
        return await this.eventService.getEventByID(id)
    }


    @Put('/update/:id')
    async updateEvent(@Param() id: number, @Body() event: UpdateEventDto) {
        return await this.eventService.updateEvent(id, event)
       
    }

    @Delete('/delete/:id')
    async deleteEvent(@Param() id: number) {
        return await this.eventService.deleteEvent(id)
    }
}
