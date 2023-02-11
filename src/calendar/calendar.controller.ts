import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { timeStamp } from 'console';
import { query } from 'express';
import { CalendarDto, CreateCalendarDto } from './calendar.dto';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { Event } from 'src/event/event.entity';
import *  as fs from 'fs'
import *  as path  from  'path'


@Controller('calendar')
export class CalendarController {

    constructor(private readonly calendarService: CalendarService){}

    @Get()
    create(){
        return "hello"
    }


    @Post('/create')
    async createCalendar(@Body() calendar: CreateCalendarDto): Promise<Calendar>{
        const data =  fs.readFileSync('C:/Users/Jetsa/cmu-acad-backend/src/asset/holiday.json','utf-8')
        const jsonData = JSON.parse(data)
        const newCalendar = new Calendar()
        let arr: Event[] = []
        Object.keys(jsonData).forEach((key)=> {
            arr.push(jsonData[key])
        })
        newCalendar.name = calendar.name
        newCalendar.semester = calendar.semester
        newCalendar.calendar_status = calendar.calendar_status
        newCalendar.start_semester = calendar.start_semester
        return  await this.calendarService.createCalendar(newCalendar,arr)
    }

    @Post('duplicate/:id')
    async duplicateClanedar(@Param() id:number,@Body('calendar_name') calendar_name: string): Promise<Calendar>{
        const  oldCalendar = await this.calendarService.findById(id)
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
    async findCalendar(){
        return this.calendarService.findAll()
    }

    @Get('/findArchive')
    async findArchieveCalendar(){
        return this.calendarService.findArchive()
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
        console.log(id)
        return this.calendarService.changeStatus(id,calendar)
    }

    @Put('/update/:id')
    async updateCalendar(@Param () id: number, @Body() calendar: Calendar){
        return this.calendarService.update(id,calendar)
    }

    @Delete('/delete-real/:id')
    async delete(@Param() id:number){
        return await this.calendarService.deleteCalendar(id)
    }

    @Delete('/delete/:id')
    async softDelete(@Param()  id: number[]){
        console.log(id)
        return await this.calendarService.softDelete(id)
    }

    @Put('restore/:id')
    async restore(@Param() id: number){
        return await   this.calendarService.restoreDelete(id)
    }
}
