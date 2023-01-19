import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { query } from 'express';
import { CalendarDto, CreateCalendarDto } from './calendar.dto';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService){}

    @Get()
    create(){
        return "hello"
    }

    @Post('/create')
    async createCalendar(@Body() calendar: CreateCalendarDto): Promise<Calendar>{
        const newCalendar = new Calendar()
        newCalendar.name = calendar.name
        newCalendar.date_semester = calendar.date_semester
        newCalendar.calendar_status = calendar.calendar_status
        return  await this.calendarService.createCalendar(newCalendar)
    }

    @Post('duplicate/:id')
    async duplicateClanedar(@Param() id:number,@Body('calendar_name') calendar_name: string): Promise<Calendar>{
        const  oldCalendar = await this.calendarService.findById(id)
        const newCalendar = new Calendar()
        newCalendar.name = calendar_name
        newCalendar.date_semester = oldCalendar.date_semester
        newCalendar.calendar_status = oldCalendar.calendar_status
        return await this.calendarService.createCalendar(newCalendar)
    }

    @Get('/findAll')
    async findCalendar(){
        return this.calendarService.findAll()
    }

    @Get('/findByName')
    async findName(@Query('query') query){
        console.log(query)
        return this.calendarService.findByName(query)
    }

    @Get('/sort')
    async sortCalendar(@Query('queryType') queryType: string){
        return this.calendarService.sortByDate(queryType)
    }

    @Get('/findDeleted/:id')
    async findDelete(id:number){
        return this.calendarService.findDelete(id)
    }

    @Get(':id')
    async findById(@Param('id') id: number){
        return this.calendarService.findById(id)
    }

    @Put('setstatus/:id')
    async updateStatus(@Param() id: number, @Body() calendar: Calendar){
        return this.calendarService.changeStatus(id,calendar)
    }

    @Put('/update/:id')
    async updateCalendar(@Param () id: number, @Body() calendar: Calendar){
        return this.calendarService.update(id,calendar)
    }

    @Delete('/delete/:id')
    async delete(@Param() id:number){
        return await this.calendarService.deleteCalendar(id)
    }

    @Delete(':id')
    async softDelete(@Param()  id: number){
        console.log(id)
        return await this.calendarService.softDelete(id)
    }

    @Put(':id')
    async restore(@Param() id: number){
        return await   this.calendarService.resotreDelete(id)
    }
}
