import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../event/event.entity'
import { EventDto, QueryEventDto, UpdateEventDto } from './event.dto';
import { ApiTags } from '@nestjs/swagger/dist';
import *  as fs from 'fs'
import { MockUpEvent } from './mockup.entity';


@ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }
   
    
    @Get('/')
    async findAll() {
        return await this.eventService.findAll();
    }


    @Post('/mockHolidayData')
    async mockData(){
        const holidayData = fs.readFileSync(process.cwd() + '/src/asset/holiday.json', 'utf-8')
        const holiday = JSON.parse(holidayData)
        await holiday.map((data,idx)=>{
            data.start_date = new Date(data.start_date)
            const setYear = new Date().getFullYear()
            const setEventName = (b) => {
                return `${data.event_name} ${(new Date(b).getFullYear()) + 543}`
            }
            const setDate = (a) => {
                return new Date(data.start_date).setFullYear(a)
            }
            if (data.isNextYear == true) {
                const year = setDate(setYear + 1)
                const setTime = new Date(year).setUTCHours(0,0,0,0)
                data.start_date = new Date(setTime)
                data.event_name = setEventName(year)
            } else {
                const year = setDate(setYear)
                 const setTime = new Date(year).setUTCHours(0,0,0,0)
                 data.start_date = new Date(setTime)
                 data.event_name = setEventName(setTime)
            }
        })
        return this.eventService.mockData(holiday)
    }

    @Get('/findHolidayMockUp')
    async findHolidayMockData(){
        return this.eventService.findHoldayMockData()
    }

    @Put('/updateHolidayMockUp')
    async UpdateHolidayMockUp(@Param() id: number,@Body() mockData: MockUpEvent){       
        return this.eventService.updateholidayMockData(id,mockData)
    }

    @Post('/addHolidayMockUp')
    async addHoldayMockUp(@Body() mockData){
        return this.eventService.addholidayMockData(mockData)
    }

    @Delete('/removeHolidayMockUp/:id')
    async removeHoldayMockUp(@Param() id){
        return this.eventService.removeHolidayMockData(id)
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
