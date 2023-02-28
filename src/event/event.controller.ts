import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../event/event.entity'
import *  as fs from 'fs'
import { UpdateEventDto } from './event.dto';


@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Get('/')
    async findAll() {
        return await this.eventService.findAll();
    }

    @Post('/create')
    async createEvent(@Body() event: Event) {
        const newEvent = new Event()
        newEvent.event_name = event.event_name
        newEvent.type = event.type
        newEvent.calendar = event.calendar
        newEvent.start_date = event.start_date
        console.log(newEvent)
        return await this.eventService.createEvent(newEvent)
    }

    @Post('/auto-gen')
    async autoGenerate(@Body('start_semester') start_semester) {
        const arr = []
        const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        const event = JSON.parse(dataEvent)
        event[0].start_date = new Date(start_semester)
        for (let i in event) {
            if (event[i].reference_event) {
                const index = event[i].reference_event - 1
                const con_index = event[i].reference_condition - 1
                if (event[i].ref_start == 'before') {
                    if (event[i].ref_end == 'before') {
                        const year = new Date(event[con_index].start_date).getFullYear()
                        const month = new Date(event[con_index].start_date).getMonth()
                        const day = new Date(event[con_index].start_date).getDate() - (event[i].num_weeks * 7 + event[i].num_days) //start date before 
                        const start_date = new Date(year, month, day)

                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() - 1 // end date before ref_condition 1 days
                        const end_date = new Date(last_year, last_month, last_day)

                        event[i].start_date = start_date
                        event[i].end_date = end_date

                    } else
                        if (event[i].ref_end == 'after') {
                            const year = new Date(event[con_index].start_date).getFullYear()
                            const month = new Date(event[con_index].start_date).getMonth()
                            const day = new Date(event[con_index].start_date).getDay() - (event[i].num_weeks * 7 + event[i].num_days) //start date before
                            const start_date = new Date(year, month, day)

                            const last_year = new Date(event[con_index].start_date).getFullYear()
                            const last_month = new Date(event[con_index].start_date).getMonth()
                            const last_day = new Date(event[con_index].start_date).getDate() + 1 // end date after ref_condition 1 days
                            const end_date = new Date(last_year, last_month, last_day)

                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        } else
                            if (event[i].ref_end == 'after-last') {

                                console.log("before and after last")
                                const year = new Date(event[con_index].start_date).getFullYear()
                                const month = new Date(event[con_index].start_date).getMonth()
                                const day = new Date(event[con_index].start_date).getDay() - (event[i].num_weeks * 7 + event[i].num_days) //start date before
                                const start_date = new Date(year, month, day)

                                const last_year = new Date(event[con_index].end_date).getFullYear()
                                const last_month = new Date(event[con_index].end_date).getMonth()
                                const last_day = new Date(event[con_index].end_date).getDay() + 1 // end date after last ref_condition 1 days
                                const end_date = new Date(last_year, last_month, last_day)

                                event[i].start_date = start_date
                                event[i].end_date = end_date
                            }
                    //normal case have only ref_start = before
                    const year = new Date(event[index].start_date).getFullYear()
                    const month = new Date(event[index].start_date).getMonth()
                    const day = new Date(event[index].start_date).getDate() - (event[i].num_weeks * 7 + event[i].num_days)
                    const start_date = new Date(year, month, day)
                    const last_year = new Date(start_date).getFullYear()
                    const last_month = new Date(start_date).getMonth()
                    const last_day = new Date(start_date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                    const end_date = new Date(last_year, last_month, last_day)
                    event[i].start_date = start_date
                    event[i].end_date = end_date

                }

                if (event[i].ref_start == 'after') {
                    if (event[i].ref_end == 'before') {
                        const year = new Date(event[index].start_date).getFullYear()
                        const month = new Date(event[index].start_date).getMonth()
                        const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                        const start_date = new Date(year, month, day)

                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() - 1 //end date before ref_condition
                        const end = new Date(last_year, last_month, last_day)
                        event[i].start_date = start_date
                        event[i].end_date = end

                    } else if (event[i].ref_end == 'after') {
                        const year = new Date(event[index].start_date).getFullYear()
                        const month = new Date(event[index].start_date).getMonth()
                        const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                        const start_date = new Date(year, month, day)

                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() + 1
                        const end_date = new Date(last_year, last_month, last_day)

                        event[i].start_date = start_date
                        event[i].end_date = end_date

                    } else if (event[i].ref_end == 'after-last') {
                        const year = new Date(event[index].start_date).getFullYear()
                        const month = new Date(event[index].start_date).getMonth()
                        const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].end_date).getFullYear()
                        const last_month = new Date(event[con_index].end_date).getMonth()
                        const last_day = new Date(event[con_index].end_date).getDate() + 1
                        const end_date = new Date(last_year, last_month, last_day)
                        event[i].start_date = start_date
                        event[i].end_date = end_date

                    }

                    //normal cas have only ref_start = after
                    const year = new Date(event[index].start_date).getFullYear()
                    const month = new Date(event[index].start_date).getMonth()
                    const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                    const start_date = new Date(year, month, day)
                    const last_year = new Date(start_date).getFullYear()
                    const last_month = new Date(start_date).getMonth()
                    const last_day = new Date(start_date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                    const end_date = new Date(last_year, last_month, last_day)
                    event[i].start_date = start_date
                    event[i].end_date = end_date


                }
                if (event[i].ref_start == 'after-last') {
                    if (event[i].ref_end == 'before') {
                        const year = new Date(event[index].end_date).getFullYear()
                        const month = new Date(event[index].end_date).getMonth()
                        const day = new Date(event[index].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after last day of ref_start
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() - 1 //end date before start date of ref_condition
                        const end_date = new Date(last_year, last_month, last_day)
                        event[i].start_date = start_date
                        event[i].end_date = end_date
                    } else if (event[i].ref_end == 'after') {
                        const year = new Date(event[index].end_date).getFullYear()
                        const month = new Date(event[index].end_date).getMonth()
                        const day = new Date(event[index].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after last day of ref_start
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() + 1 //end date before start date of ref_condition
                        const end_date = new Date(last_year, last_month, last_day)
                        event[i].start_date = start_date
                        event[i].end_date = end_date

                    }
                    else if (event[i].ref_end == 'after-last') {
                        const year = new Date(event[index].end_date).getFullYear()
                        const month = new Date(event[index].end_date).getMonth()
                        const day = new Date(event[index].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after last day of ref_start
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].end_date).getFullYear()
                        const last_month = new Date(event[con_index].end_date).getMonth()
                        const last_day = new Date(event[con_index].end_date).getDate() + 1
                        const end_date = new Date(last_year, last_month, last_day)
                        event[i].start_date = start_date
                        event[i].end_date = end_date

                    }
                    const year = new Date(event[index].end_date).getFullYear()
                    const month = new Date(event[index].end_date).getMonth()
                    const day = new Date(event[index].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                    const start_date = new Date(year, month, day)
                    const last_year = new Date(start_date).getFullYear()
                    const last_month = new Date(start_date).getMonth()
                    const last_day = new Date(start_date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                    const end_date = new Date(last_year, last_month, last_day)
                    event[i].start_date = start_date
                    event[i].end_date = end_date
                }

            }
        }
        return this.eventService.countWeek(event)

    }

    @Get('/find/:id')
    async findEvent(@Param() id: number) {
        return await this.eventService.getEventByID(id)
    }


    @Put('/update/:id')
    async updateEvent(@Param() id: number, @Body() event: UpdateEventDto) {
        return await this.eventService.updateEvent(id, event)
       
    }

    @Delete('/delete/:id')
    async deleteEvent(@Param() id: number) {
        return await this.eventService.deleteEvent(id)
    }
}
