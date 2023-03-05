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
        private readonly eventService: EventService) { }

    @Post('/create')
    async createCalendar(@Body() calendar: Calendar) {
        const data = fs.readFileSync('src/asset/holiday.json', 'utf-8')
        const jsonData = JSON.parse(data)
        const eventData = await this.eventService.autoGenerate(calendar.start_semester)
        let arr = []
        
        Object.keys(eventData).forEach((key) => {
            arr.push(eventData[key])
        })

        Object.keys(jsonData).forEach((key) => {
            const year = new Date(jsonData[key].start_date).setFullYear(new Date(calendar.start_semester).getFullYear())
            jsonData[key].start_date = new Date(year)
            arr.push(jsonData[key])

        })


        return await this.calendarService.createCalendar(calendar, arr)
    }

    @Get('studyweek/:id')
    async getStudyWeek(@Param() id) {
        const count = await this.eventService.countWeek(id)
    }

    @Post('duplicate/:id')
    async duplicateClanedar(@Param() id: number, @Body('calendar_name') calendar_name: string): Promise<Calendar> {
        const oldCalendar = await this.calendarService.findById(id)
        const newCalendar = new Calendar()
        newCalendar.name = calendar_name
        newCalendar.start_semester = oldCalendar.start_semester
        newCalendar.calendar_status = oldCalendar.calendar_status
        newCalendar.events = oldCalendar.events
        newCalendar.year = oldCalendar.year
        return await this.calendarService.duplicateCalendar(newCalendar)
    }

    @Get('/findAll')
    async findCalendar() {
        return this.calendarService.findAll()
    }

    @Get('findEventById/:id')
    async findEventByCalendar(@Param() id) {
        return this.calendarService.findEventById(id.id)
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

    // @Delete('/deleteArr')
    // async DeleteArr(@Param('id') id: string[]){
    //         return this.calendarService.deleteA()
    // }

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
