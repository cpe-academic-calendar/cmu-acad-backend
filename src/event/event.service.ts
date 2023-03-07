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
        // const holiday = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/holiday.json', 'utf-8')
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
        let start = []
        let end = []
        let start2 = []
        let end2 = []
        let start3 = []
        let end3 = []
        let holiday = []
        const evnetArr = event[0].map((edt) => edt)

        for (let i in evnetArr) {
            if (evnetArr[i].event_name == 'วันเปิดภาคเรียน') {
                start.push(evnetArr[i])
            }
            if (evnetArr[i].event_name == 'วันสุดท้ายของการศึกษา') {
                end.push(evnetArr[i])
            }
            if (evnetArr[i].event_name == 'วันเปิดภาคเรียน เทอม 2') {
                start2.push(evnetArr[i])
            }
            if (evnetArr[i].event_name == 'วันสุดท้ายของการศึกษา เทอม 2') {
                end2.push(evnetArr[i])
            }
            if (evnetArr[i].event_name == 'วันเปิดภาคเรียน เทอม 3') {
                start3.push(evnetArr[i])
            }
            if (evnetArr[i].event_name == 'วันสุดท้ายของการศึกษา เทอม 3') {
                end3.push(evnetArr[i])
            }

            if (evnetArr[i].type == 'วันสอบ' || evnetArr[i].type == 'วันหยุด') {
                holiday.push(evnetArr[i].start_date)
            }
        }


        const dateArr1 = eachDayOfInterval({
            start: new Date(`${start[0].start_date}`),
            end: new Date(`${end[0].start_date}`)
        })
        const dateArr2 = eachDayOfInterval({
            start: new Date(`${start2[0].start_date}`),
            end: new Date(`${end2[0].start_date}`)
        })



        const dateArr3 = eachDayOfInterval({
            start: new Date(`${start3[0].start_date}`),
            end: new Date(`${end3[0].start_date}`)
        })



        const arrDate = dateArr1.map((date) => {
            return date.toISOString().split('T')[0]
        })
        const arrDate2 = dateArr2.map((date) => {
            return date.toISOString().split('T')[0]
        })
        const arrDate3 = dateArr3.map((date) => {
            return date.toISOString().split('T')[0]
        })

        const arrHoliday = holiday.map((date) => {
            return date.toISOString().split('T')[0]
        })

        const countTerm1 = arrDate.filter(value => !arrHoliday.includes(value))
        const countTerm2 = arrDate2.filter(value => !arrHoliday.includes(value))
        const countTerm3 = arrDate3.filter(value => !arrHoliday.includes(value))

        const returnCountWeek = (week: any[]) => {
            const arr1 = { sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0 }
            for (let i in week) {
                if (new Date(week[i]).getDay() == 0) {
                    arr1["sunday"] += 1
                }
                if (new Date(week[i]).getDay() == 1) {
                    arr1["monday"] += 1
                }
                if (new Date(week[i]).getDay() == 2) {
                    arr1["tuesday"] += 1

                }
                if (new Date(week[i]).getDay() == 3) {
                    arr1["wednesday"] += 1

                }
                if (new Date(week[i]).getDay() == 4) {
                    arr1["thursday"] += 1

                }
                if (new Date(week[i]).getDay() == 5) {
                    arr1["friday"] += 1

                }
                if (new Date(week[i]).getDay() == 6) {
                    arr1["saturday"] += 1

                }
            }
            return arr1
        }
        const countArr = {term1: [returnCountWeek(countTerm1)], term2: [returnCountWeek(countTerm2)], term3: [returnCountWeek(countTerm3)]}
        return countArr
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



