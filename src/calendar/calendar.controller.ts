import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { EventService } from 'src/event/event.service';
import { ApiTags } from '@nestjs/swagger';
import { QueryCalendarDto } from './calendar.dto';
import { Header, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import *  as fs from 'fs'

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
    constructor(
        private readonly calendarService: CalendarService,
        private readonly eventService: EventService) { }


    @Put('/update/eventMockUp')
    async updateJsonData(@Body() data) {
        return await this.calendarService.updateJsonData(data)
    }

    @Put('/update/holidayMockUp')
    async updateHolidayData(@Body() data) {
        console.log("holiday", data)
        return await this.calendarService.updateHolidayData(data)
    }

    @Post('/create')
    async createCalendar(@Body() calendar: Calendar) {
        return await this.calendarService.createCalendar(calendar)
    }

    @Get('findCalendarByType')
    async findCalendarByStatus(@Query('calendarStatus') queryType: string) {
        return await this.calendarService.findByStatus(queryType)
    }

    @Get('studyweek/:id/')
    async getStudyWeek(@Param() id: QueryCalendarDto) {
        const event = await this.calendarService.findEventById(id.id)
        let arr = []
        await event.map((edt) => { arr.push(edt.events.map((ev) => { return ev })) })
        return this.eventService.countWeek(arr)
    }


    @Post('duplicate/:id')
    async duplicateCalendar(@Param() calendar_id: QueryCalendarDto, @Body() calendar: Calendar) {
        const newCalendar = new Calendar();
        const oldCalendar = await this.calendarService.findEventById(calendar_id.id).then()
        const event = oldCalendar[0].events.map((ev) => ev);
        const eve = await this.eventService.createArr(event)
        newCalendar.name = calendar.name
        let arr = []
        eve.map((dt) => {
            arr.push(dt)
        })
        newCalendar.start_semester = calendar.start_semester
        newCalendar.events = [...arr]
        return await this.calendarService.duplicateCalendar(newCalendar)
    }

    @Get('/findCalendar')
    async findQueryCalendar(@Query() calendar) {
        return await this.calendarService.findByQuery(calendar)
    }


    @Get('/findAll')
    async findCalendar() {
        return this.calendarService.findAll()
    }

    @Get('findEventById/:id')
    async findEventByCalendar(@Param() id: QueryCalendarDto) {
        const event = await this.calendarService.findEventById(id.id) 
        return event.map((ev)=>{
            ev.events.map((et)=>{
                et.start_date.setDate(et.start_date.getDate() -1)
                et.start_date.setUTCHours(0,0,0,0)
                et.end_date.setDate(et.end_date.getDate() -1)
                et.end_date.setUTCHours(0,0,0,0)
                et.start_date = et.start_date
                et.end_date = et.end_date
            })
            return ev
        })
    }

    @Get('caleenedarEvent')
    async findCalendarEvent(@Param() id: QueryCalendarDto) {
        const evnet = await this.calendarService.findEventData(id.id)
        const event = await evnet.map((ed,idx)=>{
            ed.start_date = new Date(new Date(ed.start_datee).setUTCHours(0,0,0,0))
            ed.end_date = new Date(new Date(ed.end_date).setUTCHours(0,0,0,0))
            return ed
        })
        return event
    }

    @Get('findHoliday/:id')
    async findHoliday(@Param() id: QueryCalendarDto) {
        return this.calendarService.findHolidayEvent(id.id)
    }

    @Get('findEvent/:id')
    async findEvent(@Param() id: QueryCalendarDto) {
        return this.calendarService.findEventType(id.id)
    }

    @Get('/findArchive')
    async findArchieveCalendar() {
        return this.calendarService.findArchive()
    }

    @Get('/findByName')
    async findName(@Query('query') query, @Query('type') type) {
        return this.calendarService.findByName(query, type)
    }

    @Get('/sort')
    async sortCalendar(@Query('queryType') queryType: string) {
        return this.calendarService.sortByDate(queryType)
    }

    @Get('/findDeleted')
    async findDelete(@Query('name') name: QueryCalendarDto) {
        return this.calendarService.findDelete(name)
    }

    @Get(':id')
    async findById(@Param('id') id: QueryCalendarDto) {
        return this.calendarService.findById(id)
    }

    @Put('setstatus/:id')
    async updateStatus(@Param() userId: QueryCalendarDto, @Body() calendar: Calendar) {
        return this.calendarService.changeStatus(userId.id, calendar)
    }

    @Put('/update/:id')
    async updateCalendar(@Param() userId: QueryCalendarDto, @Body() calendar: Calendar) {
        return this.calendarService.update(userId.id, calendar)
    }

    @Delete('/delete-real/:id')
    async delete(@Param() userId: QueryCalendarDto) {
        return await this.calendarService.deleteCalendar(userId.id)
    }

    @Delete('/delete/:id')
    async softDelete(@Param() userId: QueryCalendarDto) {
        return await this.calendarService.softDelete(userId.id)
    }

    @Put('restore/:id')
    async restore(@Param() userId: QueryCalendarDto) {
        return await this.calendarService.restoreDelete(userId.id)
    }

    @Get('exportEvent/:id')
    @Header('Content-Type', 'text/xlsx')
    async exportFile(@Param() userId: QueryCalendarDto, @Res() res: Response) {
        const data = await this.calendarService.exportEventData(userId.id)
        res.download(`${data}`)
    }

    @Get('exportHoliday/:id')
    @Header('Conten-Type', 'text/xlsx')
    async exportHolidayFile(@Param() userId: QueryCalendarDto, @Res() res: Response) {
        const data = await this.calendarService.exportHolidayData(userId.id)
        res.download(`${data}`)
    }

    @Get('exportStudy/:id')
    @Header('Content-Type', 'text/xlsx')
    async exportStudyFile(@Param() userId: QueryCalendarDto, @Res() res: Response) {
        const event = await this.calendarService.findEventById(userId.id)
        let arr = []
        event.map((edt) => { arr.push(edt.events.map((ev) => { return ev })) })
        const dataWeek = await this.eventService.countWeek(arr)
        const data = await this.calendarService.exportStudyData(userId.id, dataWeek)
        res.download(`${data}`)
        return data
    }
}
