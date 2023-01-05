import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCalendarDto } from './calendar.dto';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService){}

    @Get()
    create(){
        console.log("hello")
        return "hello"
    }

    @Post('/create')
    async createCalendar(@Body() calendar: CreateCalendarDto): Promise<Calendar>{
        const newCalendar = new Calendar()
        newCalendar.name = calendar.name
        newCalendar.semester = calendar.semester
        newCalendar.calendar_status = calendar.calendar_status
        console.log(newCalendar)
        return  await this.calendarService.createCalendar(newCalendar)
    } 

    @Get('/findAll')
    async findCalendar(){
        return this.calendarService.findAll()
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
        console.log(id)
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
