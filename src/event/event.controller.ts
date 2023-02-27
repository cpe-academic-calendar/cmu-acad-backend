import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../event/event.entity'
import *  as fs from 'fs'


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
        return await this.eventService.createEvent(newEvent)
    }

    @Post('/auto-gen')
    async autoGenerate(@Body('start_semester') start_semester) {
        const arr = []
        const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        const event = JSON.parse(dataEvent)
        event[0].date = start_semester
        for (let i in event) {
            if (event[i].reference_event) {
                if (event[i].ref_start == 'before') {
                    const index = event[i].reference_event
                    const month = new Date(event[index].date).getMonth()
                    const year = new Date(event[index].date).getFullYear()
                    const date = new Date(event[index].date).getDate() - event[i].num_weeks * 7
                    console.log(typeof event[i].date)
                    event[i].date = new Date(year, month, date).toISOString().split('T')[0]
                }
                if (event[i].ref_start == 'after') {
                    const month = new Date(event[0].date).getMonth()
                    const year = new Date(event[0].date).getFullYear()
                    const date = new Date(event[0].date).getDate() + event[1].num_weeks * 7
                    event[1].date = new Date(year, month, date).toISOString().split('T')[0]
                }
            }
        }



    }

    @Get('/find/:id')
    async findEvent(@Param() id: number) {
        return await this.eventService.getEventByID(id)
    }

    @Put('/update/:id')
    async updateEvent(@Param() id: number, @Body() event: Event) {
        return await this.eventService.updateEvent(id, event)
    }

    @Delete('/delete/:id')
    async deleteEvent(@Param() id: number) {
        return await this.eventService.deleteEvent(id)
    }
}
