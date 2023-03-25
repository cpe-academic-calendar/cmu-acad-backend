import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../event/event.entity'
import { EventDto, QueryEventDto, UpdateEventDto } from './event.dto';
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
    async createEvent(@Body() event: EventDto) {
        const newEvent = new Event()
        newEvent.event_name = event.event_name
        newEvent.type = event.type
        newEvent.calendar = event.calendar
        newEvent.start_date = new Date(event.start_date)
        newEvent.end_date = new Date(event.end_date)
        newEvent.color = event.color
        return await this.eventService.createEvent(newEvent)
    }


    @Get('/find/:id')
    async findEvent(@Param() user: QueryEventDto) {
        return await this.eventService.getEventByID(user.id)
    }


    @Put('/update/:id')
    async updateEvent(@Param() id: QueryEventDto, @Body() event: UpdateEventDto) {
        return await this.eventService.updateEvent(id, event)
    }

    
    @Delete('/delete/:id')
    async deleteEvent(@Param() user: QueryEventDto) {
        return await this.eventService.deleteEvent(user.id)
    }
}
