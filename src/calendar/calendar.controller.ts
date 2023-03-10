import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { EventService } from 'src/event/event.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCalendarDto } from './calendar.dto';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
    constructor(
        private readonly calendarService: CalendarService,
        private readonly eventService: EventService) { }

    @Post('/create')
    async createCalendar(@Body() calendar: Calendar) {
        return await this.calendarService.createCalendar(calendar)
    }

    @Get('studyweek/:id')
    async getStudyWeek(@Param() id) {
        const event = await this.calendarService.findEventById(id.id)
        let arr = []
        event.map((edt) => { arr.push(edt.events.map((ev) => { return ev })) })
        return this.eventService.countWeek(arr)
    }

    @Post('duplicate/:id')
    async duplicateCalendar(@Param() calendar_id: UpdateCalendarDto, @Body() calendar: Calendar) {
        const newCalendar = new Calendar();
        const oldCalendar = await this.calendarService.findEventById(calendar_id.id).then()
        const event = oldCalendar[0].events.map((ev) => ev);
        const eve = await this.eventService.createArr(event) 
        newCalendar.name = calendar.name
        let arr = []
        eve.map((dt)=>{
            arr.push(dt)
        })
        newCalendar.events = [...arr]
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

    @Get('findEvent/:id')
    async findEvent(@Param() id) {
        return this.calendarService.findEventType(id.id)
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
}
