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
    async updateHolidayData(@Body() data){
        console.log("holiday",data)
        return await this.calendarService.updateHolidayData(data)
    }

    @Post('/create')
    async createCalendar(@Body() calendar: Calendar) {
        return await this.calendarService.createCalendar(calendar)
    }


    @Get('findConditionData')
    async findAllEvent() {
        const dataEvent = fs.readFileSync(process.cwd() + '/src/asset/event.json', 'utf-8')
        const event = JSON.parse(dataEvent)
        for (let i in event) {
            let last_idx = event[i].reference_condition - 1
            if (event[i].reference_condition && !event[i].reference_event) {
                event[i].reference_condition = event[last_idx].event_name
            }
            if (event[i].reference_event && ! event[i].ref_condition) {
                event[i].reference_event = event[event[i].reference_event - 1].event_name
            }
            if (event[i].reference_condition && event[i].reference_event) {
                event[i].reference_event = event[last_idx].event_name
                event[i].reference_condition = event[last_idx].event_name
            }
        }
        return event
    }

    @Get('findHolidayData')
    async findAllHoliday() {
        const holidayEvent = fs.readFileSync(process.cwd() + '/src/asset/holiday.json', 'utf-8')
        const holiday = JSON.parse(holidayEvent)
        console.log(holiday)
        return holiday
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
        return this.calendarService.findEventById(id.id)
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
