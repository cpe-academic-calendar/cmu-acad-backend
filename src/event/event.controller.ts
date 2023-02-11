import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import {Event}  from '../event/event.entity'


@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService){}

    @Post('/create')
    async createEvent(@Body() event:  Event){
        const newEvent = new Event()
        newEvent.event_name = event.event_name
        newEvent.type = event.type
        newEvent.calendar =  event.calendar
        return await this.eventService.createEvent(newEvent)
    }
}
