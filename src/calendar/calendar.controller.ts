import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCalendarDto } from './calendar.dto';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import *  as fs from 'fs'
import { EventService } from 'src/event/event.service';


@Controller('calendar')
export class CalendarController {

    constructor(
        private readonly calendarService: CalendarService,
        private readonly eventService: EventService ) {}

    @Post('/create')
    async createCalendar(@Body() calendar: CreateCalendarDto) {
        const data = fs.readFileSync('C:/Users/Jetsa/cmu-acad-backend/src/asset/holiday.json', 'utf-8')
        // const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        // const event = JSON.parse(dataEvent)
        const jsonData = JSON.parse(data)
        let arr = []
        // Object.keys(event).forEach((key) => {
            // arr.push(event[key])
        // })
        Object.keys(jsonData).forEach((key) => {
            console.log(new Date(new Date(jsonData[key].date).setFullYear(2024)).toISOString())
            // arr.push(jsonData[key])
        })
        // const newCalendar = new Calendar()
        // newCalendar.name = calendar.name
        // newCalendar.semester = calendar.semester
        // newCalendar.calendar_status = calendar.calendar_status
        // return await this.calendarService.createCalendar(newCalendar, arr)
    }

    @Post('duplicate/:id')
    async duplicateClanedar(@Param() id: number, @Body('calendar_name') calendar_name: string): Promise<Calendar> {
        const oldCalendar = await this.calendarService.findById(id)
        console.log(oldCalendar)
        const newCalendar = new Calendar()
        newCalendar.name = calendar_name
        newCalendar.start_semester = oldCalendar.start_semester
        newCalendar.semester = oldCalendar.semester
        newCalendar.calendar_status = oldCalendar.calendar_status
        newCalendar.events = oldCalendar.events
        return await this.calendarService.duplicateCalendar(newCalendar)
    }

    @Get('/findAll')
    async findCalendar() {
        return this.calendarService.findAll()
    }

    @Get('findHoliday')
    async findHoliday() {
        return this.calendarService.findHolidayEvent()
    }

    @Get('findEventType')
    async findEventType() {
        return this.calendarService.findEventType()
    }

    @Get('findEvent')
    async findEvent() {
        return this.calendarService.findEvent()
    }

    @Get('/findArchive')
    async findArchieveCalendar() {
        return this.calendarService.findArchive()
    }

    @Get('/findByName')
    async findName(@Query('query') query) {
        console.log(query)
        return this.calendarService.findByName(query)
    }

    @Get('/sort')
    async sortCalendar(@Query('queryType') queryType: string) {
        return this.calendarService.sortByDate(queryType)
    }

    @Get('/findDeleted/:id')
    async findDelete(id: number) {
        return this.calendarService.findDelete(id)
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.calendarService.findById(id)
    }

    @Put('setstatus/:id')
    async updateStatus(@Param() id: number, @Body() calendar: Calendar) {
        console.log(id)
        return this.calendarService.changeStatus(id, calendar)
    }

    @Put('/update/:id')
    async updateCalendar(@Param() id: number, @Body() calendar: Calendar) {
        return this.calendarService.update(id, calendar)
    }

    @Delete('/delete-real/:id')
    async delete(@Param() id: number) {
        return await this.calendarService.deleteCalendar(id)
    }

    @Delete('/delete/:id')
    async softDelete(@Param() id: number[]) {
        console.log(id)
        return await this.calendarService.softDelete(id)
    }

    @Put('restore/:id')
    async restore(@Param() id: number) {
        return await this.calendarService.restoreDelete(id)
    }
}
