import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCalendarDto } from './calendar.dto';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import *  as fs from 'fs'
import { EventService } from 'src/event/event.service';
import * as path from 'path';
import { response } from 'express';
import { Header } from '@nestjs/common/decorators';
import { dirname } from 'path';
const csvWriter = require('csv-writer');


@Controller('calendar')
export class CalendarController {
    constructor(
        private readonly calendarService: CalendarService,
        private readonly eventService: EventService) { }

    @Post('/create')
<<<<<<< HEAD
    async createCalendar(@Body() calendar: Calendar) {
        const data = fs.readFileSync(process.cwd()+'/src/asset/holiday.json', 'utf-8')
=======
    async createCalendar(@Body() calendar: CreateCalendarDto) {
        const data = fs.readFileSync('src/asset/holiday.json', 'utf-8')
        // const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        // const event = JSON.parse(dataEvent)
>>>>>>> 2671bc1 (fix: database entity)
        const jsonData = JSON.parse(data)
        const eventData = await this.eventService.autoGenerate(calendar.start_semester)
        let arr = []
<<<<<<< HEAD

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
        const event = await this.calendarService.findEventById(id.id)
        let arr = []
        for (let i in event) {
            arr.push(event[i].events.map((edt) => edt))
        }
        return this.eventService.countWeek(arr)

=======
        // Object.keys(event).forEach((key) => {
            // arr.push(event[key])
        // })
        const year = Number(calendar.year) - 543
        Object.keys(jsonData).forEach((key) => {
<<<<<<< HEAD
            jsonData[key].date = new Date(new Date(jsonData[key].date).setFullYear(year))
=======
            console.log(new Date(new Date(jsonData[key].date).setFullYear(2024)).toISOString())
>>>>>>> 2671bc1 (fix: database entity)
            arr.push(jsonData[key])
        })
        const newCalendar = new Calendar()
        newCalendar.name = calendar.name
        newCalendar.year = calendar.year
        newCalendar.calendar_status = calendar.calendar_status
        return await this.calendarService.createCalendar(newCalendar, arr)
<<<<<<< HEAD
>>>>>>> c0660fe (feat: generate holiday)
=======
>>>>>>> 2671bc1 (fix: database entity)
    }

    @Post('duplicate/:id')
    async duplicateClanedar(@Param() id: number, @Body('calendar_name') calendar_name: string): Promise<Calendar> {
        const oldCalendar = await this.calendarService.findById(id)
        const newCalendar = new Calendar()
        newCalendar.name = calendar_name
        newCalendar.start_semester = oldCalendar.start_semester
<<<<<<< HEAD
<<<<<<< HEAD
=======
        newCalendar.year = oldCalendar.year
>>>>>>> c0660fe (feat: generate holiday)
=======
        newCalendar.year = oldCalendar.year
>>>>>>> 2671bc1 (fix: database entity)
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

    @Get('findHoliday/:id')
    async findHoliday(@Param() id) {
        return this.calendarService.findHolidayEvent(id.id)
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
        return await this.calendarService.softDelete(id)
    }

    @Put('restore/:id')
    async restore(@Param() id: number) {
        return await this.calendarService.restoreDelete(id)
    }

    @Get('export/:id')
    @Header("Content-Type", "text/csv")
    @Header("Content-Disposition", "attachment; filename=sample_data.csv")
    async exportFile(@Param() id) {
        const event = await this.calendarService.findHolidayEvent(id.id)
        let arr = []
        for (let i in event) {
            arr.push(event[i].events.map((edt) => edt))
        }
        const file_header = ['ชื่อวันหยุด', 'วันที่']
        const data = JSON.parse(JSON.stringify(arr))
        const data_exporter = require('json2csv').Parser;

        const jsonData = new data_exporter({ file_header })
        const csv_data = jsonData.parse(data)
        response.header("Content-Type", "text/csv")
        response.header("Content-Disposition", "attachment; filename=sample_data.csv")
    }
}
