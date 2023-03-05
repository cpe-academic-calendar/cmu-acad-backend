import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateEvent } from 'typeorm';
import { Event } from './event.entity';
import *  as fs from 'fs'
import { eachDayOfInterval } from 'date-fns'
import { UpdateEventDto } from './event.dto';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    async autoGenerate(start_semester) {
        const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        const holiday = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/holiday.json', 'utf-8')
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
        return event
    }
    async countWeek(event) {
        let eventMap = new Map();
        let holiday = [];

        event.forEach(function (event) {
            eventMap.set(event.event_name, event.start_date);
            switch (event.event_name) {
                case 'วันเตรียมสอบกลางภาคการศึกษา (งดการสอนและการสอบ)':
                case 'วันเตรียมสอบกลางภาคการศึกษา (งดการสอนและการสอบ) เทอม 2':
                case 'วันสอบกลางภาคการศึกษา (งดการสอน)':
                case 'วันสอบกลางภาคการศึกษา (งดการสอน) เทอม 2':
                case 'วันสอบไล่':
                case 'วันสอบไล่ เทอม 2':
                case 'วันสอบไล่ เทอม 3':
                    holiday.push(event.start_date);
                    holiday.push(event.end_date);
                    break;
            }
        });
        return eventMap

    }

    async groupOfDay() {
        const first_term = []
        const arr = { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 }
        for (let i in first_term) {
            if (first_term[i].getDay() == 0) {
                arr["sunday"] += 1
            }
            if (first_term[i].getDay() == 1) {
                arr["monday"] += 1
            }
            if (first_term[i].getDay() == 2) {
                arr["tuesday"] += 1
            }
            if (first_term[i].getDay() == 3) {
                arr["wednesday"] += 1
            }
            if (first_term[i].getDay() == 4) {
                arr["thursday"] += 1
            }
            if (first_term[i].getDay() == 5) {
                arr["friday"] += 1
            }
            if (first_term[i].getDay() == 6) {
                arr["saturday"] += 1
            }
        }
    }

    async findAll() {
        return await this.eventRepository.find()
    }

    async createEvent(event) {
        return await this.eventRepository.save(event)
    }

    async getEventByID(id: number) {
        return await this.eventRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async updateEvent(id: number, event: UpdateEventDto) {
        return await this.eventRepository.update(id, event)
    }

    async deleteEvent(id: number) {
        return await this.eventRepository.delete(id)
    }


}



