import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../event/event.entity'
import { EventDto, UpdateEventDto } from './event.dto';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Event')
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
        newEvent.color = event.color
        return await this.eventService.createEvent(newEvent)
    }

    @Get('/find/:id')
    async findEvent(@Param() id: number) {
        return await this.eventService.getEventByID(id)
    }


    @Put('/update/:id')
    async updateEvent(@Param() id: number, @Body() event: Event) {
        console.log(event)
        return await this.eventService.updateEvent(id, event)
    }

    
    @Delete('/delete/:id')
    async deleteEvent(@Param() id: number) {
        return await this.eventService.deleteEvent(id)
    }
}
