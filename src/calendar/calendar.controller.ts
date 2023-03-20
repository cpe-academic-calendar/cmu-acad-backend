import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { EventService } from 'src/event/event.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCalendarDto } from './calendar.dto';
import { Header, Res } from '@nestjs/common/decorators';
import { Response } from 'express';

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


    @Get('findCalendarByType')
    async findCalendarByStatus(@Query() calendarStatus){
        return await this.calendarService.findByStatus(calendarStatus.calendarStatus)
    }


    @Get('studyweek/:id')
    async getStudyWeek(@Param() id,@Body() user) {
        const event = await this.calendarService.findEventById(id.id,user)
        let arr = []
        event.map((edt) => { arr.push(edt.events.map((ev) => { return ev })) })
        return this.eventService.countWeek(arr)
    }

    @Post('duplicate/:id')
    async duplicateCalendar(@Param() calendar_id: UpdateCalendarDto, @Body() calendar: Calendar) {
        const newCalendar = new Calendar();
        const oldCalendar = await this.calendarService.findEventById(calendar_id.id,calendar).then()
        const event = oldCalendar[0].events.map((ev) => ev);
        const eve = await this.eventService.createArr(event)
        newCalendar.name = calendar.name
        let arr = []
        eve.map((dt) => {
            arr.push(dt)
        })
        newCalendar.user_id = calendar.user_id
        newCalendar.events = [...arr]
        return await this.calendarService.duplicateCalendar(newCalendar)
    }

    @Get('/findAll')
    async findCalendar(@Body() user) {
        return this.calendarService.findAll(user)
    }

    @Get('findEventById/:id')
    async findEventByCalendar(@Param() id,@Body() user) {
        return this.calendarService.findEventById(id.id,user)
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
    async findName(@Query('query') query,@Query('type') type,@Body() user) {
        return this.calendarService.findByName(query,type,user)
    }

    @Get('/sort')
    async sortCalendar(@Query('queryType') queryType: string) {
        return this.calendarService.sortByDate(queryType)
    }

    @Get('/findDeleted/:id')
    async findDelete(@Param()id: number,@Body() user) {
        return this.calendarService.findDelete(id,user)
    }

    @Get(':id')
    async findById(@Param('id') id: number,@Body() user) {
        return this.calendarService.findById(id,user)
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

    @Get('exportEvent/:id')
    @Header('Content-Type', 'text/xlsx')
    async exportFile(@Param() id, @Res() res: Response) {
        const data = await this.calendarService.exportEventData(id.id)
        res.download(`${data}`)
    }

    @Get('exportHoliday/:id')
    @Header('Conten-Type', 'text/xlsx')
    async exportHolidayFile(@Param() id,@Res() res: Response){
        const data = await this.calendarService.exportHolidayData(id.id)
        res.download(`${data}`)
    }

    @Get('exportDraft/:id')
    @Header('Conten-Type', 'text/xlsx')
    async exportDraftFile(@Param() id,@Res() res: Response){
        const data = await this.calendarService.exportDraftCalendar(id.id)
        res.download(`${data}`)
        return data
    }


    @Get('exportStudy/:id')
    @Header('Content-Type','text/xlsx')
    async exportStudyFile(@Param() id,@Res() res: Response,@Body() user){
        const event = await this.calendarService.findEventById(id.id,user)
        let arr = []
        event.map((edt) => { arr.push(edt.events.map((ev) => { return ev })) })
        const dataWeek = await this.eventService.countWeek(arr)
        const data = await this.calendarService.exportStudyData(id.id,dataWeek)
        res.download(`${data}`)
        return data
    }
}
