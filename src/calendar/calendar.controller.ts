import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { EventService } from 'src/event/event.service';

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
        for (let i in event) {
            arr.push(event[i].events.map((edt) => edt))
        }
        return this.eventService.countWeek(arr)
    }

    @Post('duplicate/:id')
    async duplicateClanedar(@Param() id, @Body('calendar_name') calendar_name: string){
        const oldCalendar = await this.calendarService.findById(id.id)
        const evet = await this.calendarService.findEventById(id.id)
        let arr = []
        console.log(evet.map(ev=>{
            return arr.push(ev.events.map((d)=>{
                    d.event_name,
                    d.start_date,
                    d.type
            }))
        }))
        // const newCalendar = new Calendar()
        // newCalendar.name = calendar_name
        // newCalendar.start_semester = oldCalendar.start_semester
        // newCalendar.calendar_status = oldCalendar.calendar_status
        // newCalendar.year = oldCalendar.year
        
        // return await this.calendarService.duplicateCalendar(newCalendar)
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
