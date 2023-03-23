import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import *  as fs from 'fs'
import { eachDayOfInterval } from 'date-fns'
import { Not } from 'typeorm';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    async autoGenerate(start_semester) {
        const dataEvent = fs.readFileSync(process.cwd() + '/src/asset/event.json', 'utf-8')
        const event = JSON.parse(dataEvent)
        event[0].start_date = new Date(start_semester)
        event[0].end_date = new Date(start_semester)
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
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end_date
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        }

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
                            if (event[i].isAffair == true) {
                                const newDate = await this.setDay(start_date)
                                event[i].start_date = newDate
                                event[i].end_date = end_date
                            } else {
                                event[i].start_date = start_date
                                event[i].end_date = end_date
                            }
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
                                if (event[i].isAffair == true) {
                                    const newDate = await this.setDay(start_date)
                                    event[i].start_date = newDate
                                    event[i].end_date = end_date
                                } else {
                                    event[i].start_date = start_date
                                    event[i].end_date = end_date
                                }
                            }
                    //normal case have only ref_start = before
                    const year = new Date(event[index].start_date).getFullYear()
                    const month = new Date(event[index].start_date).getMonth()
                    const day = new Date(event[index].start_date).getDate() - (event[i].num_weeks * 7 + event[i].num_days)
                    const start_date = new Date(year, month, day)

                    const setLastdate = (date) => {
                        const last_year = new Date(date).getFullYear()
                        const last_month = new Date(date).getMonth()
                        const last_day = new Date(date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                        const end_date = new Date(last_year, last_month, last_day)
                        return end_date
                    }
                    const last_year = new Date(start_date).getFullYear()
                    const last_month = new Date(start_date).getMonth()
                    const last_day = new Date(start_date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                    const end_date = new Date(last_year, last_month, last_day)


                    if (event[i].isAffair == true) {
                        const newDate = await this.setDay(start_date)
                        event[i].start_date = newDate
                        event[i].end_date = await setLastdate(newDate)
                    } else {
                        event[i].start_date = start_date
                        event[i].end_date = setLastdate(start_date)
                    }

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
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end
                        }
                    } else if (event[i].ref_end == 'after') {
                        const year = new Date(event[index].start_date).getFullYear()
                        const month = new Date(event[index].start_date).getMonth()
                        const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() + 1
                        const end_date = new Date(last_year, last_month, last_day)
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end_date
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        }

                    } else if (event[i].ref_end == 'after-last') {
                        const year = new Date(event[index].start_date).getFullYear()
                        const month = new Date(event[index].start_date).getMonth()
                        const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].end_date).getFullYear()
                        const last_month = new Date(event[con_index].end_date).getMonth()
                        const last_day = new Date(event[con_index].end_date).getDate() + 1
                        const end_date = new Date(last_year, last_month, last_day)
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end_date
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        }

                    }

                    //normal cas have only ref_start = after
                    const year = new Date(event[index].start_date).getFullYear()
                    const month = new Date(event[index].start_date).getMonth()
                    const day = new Date(event[index].start_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                    const start_date = new Date(year, month, day)
                    const setLastdate = (date) => {
                        const last_year = new Date(start_date).getFullYear()
                        const last_month = new Date(start_date).getMonth()
                        const last_day = new Date(start_date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                        const end_date = new Date(last_year, last_month, last_day)
                        return end_date
                    }
                    if (event[i].isAffair == true) {
                        const newDate = await this.setDay(start_date)
                        event[i].start_date = newDate
                        event[i].end_date = setLastdate(newDate)
                    } else {
                        event[i].start_date = start_date
                        event[i].end_date = setLastdate(start_date)
                    }
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
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end_date
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        }
                    } else if (event[i].ref_end == 'after') {
                        const year = new Date(event[index].end_date).getFullYear()
                        const month = new Date(event[index].end_date).getMonth()
                        const day = new Date(event[index].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after last day of ref_start
                        const start_date = new Date(year, month, day)
                        const last_year = new Date(event[con_index].start_date).getFullYear()
                        const last_month = new Date(event[con_index].start_date).getMonth()
                        const last_day = new Date(event[con_index].start_date).getDate() + 1 //end date before start date of ref_condition
                        const end_date = new Date(last_year, last_month, last_day)
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end_date
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        }
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
                        if (event[i].isAffair == true) {
                            const newDate = await this.setDay(start_date)
                            event[i].start_date = newDate
                            event[i].end_date = end_date
                        } else {
                            event[i].start_date = start_date
                            event[i].end_date = end_date
                        }
                    }
                    const year = new Date(event[index].end_date).getFullYear()
                    const month = new Date(event[index].end_date).getMonth()
                    const day = new Date(event[index].end_date).getDate() + (event[i].num_weeks * 7 + event[i].num_days) // start date after ref_start 
                    const start_date = new Date(year, month, day)
                    const setLastdate = (date) => {
                        const last_year = new Date(date).getFullYear()
                        const last_month = new Date(date).getMonth()
                        const last_day = new Date(date).getDate() + (event[i].duration_weeks * 7 + event[i].duration_days)
                        const end_date = new Date(last_year, last_month, last_day)
                        return end_date
                    }
                    if (event[i].isAffair == true) {
                        const newDate = await this.setDay(start_date)
                        event[i].start_date = newDate
                        event[i].end_date = setLastdate(newDate)
                    } else {
                        event[i].start_date = start_date
                        event[i].end_date = setLastdate(start_date)
                    }
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
            const arr1 = { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0, }
            for (let i in week) {
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
                if (new Date(week[i]).getDay() == 7) {
                    arr1["sunday"] += 1
                }
            }
            return arr1
        }
        const countArr = { term1: [returnCountWeek(countTerm1)], term2: [returnCountWeek(countTerm2)], term3: [returnCountWeek(countTerm3)] }
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

    async setDay(date) {
        const dayOfweek = date.getDay()
        if (dayOfweek != 1) {
            const daysToMonday = dayOfweek === 1 ? 1 : dayOfweek === 0 ? 0 : dayOfweek - 1
            let monday = new Date(date.getTime() - daysToMonday * 24 * 60 * 60 * 1000);
            return new Date(monday)
        } else {
            return date
        }
    }

    async updateEvent(id, event: Event) {
        const eventData = await this.eventRepository.findOne({
            where: {
                id: id.id
            },
            select: {
                calendar: {
                    id
                }
            },
            relations: {
                calendar: true
            }
        })

        const arr = await this.eventRepository.find({
            where: {
                type: 'กิจกรรม',
                calendar: {
                    id: eventData.calendar.id
                },
                event_name: Not('วันเปิดภาคเรียน')
            }
        })
        const changEnd_date = new Date(event.end_date)
        const oldEnd_date = new Date(eventData.end_date)
        let diffTimeEnd = (changEnd_date.getTime() - oldEnd_date.getTime());
        let diffDaysEnd = Math.ceil(diffTimeEnd / (1000 * 60 * 60 * 24));
        const change_date = new Date(event.start_date)
        const old_date = new Date(eventData.start_date)
        let diffTime = (change_date.getTime() - old_date.getTime());
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (event.event_name == 'วันเปิดภาคเรียน') {
            event.start_date = new Date(event.start_date)
            event.end_date = new Date(event.start_date)
            this.eventRepository.update(id, event)
            arr.map(async (data, idx) => {
                if (arr[idx].isOveride == false) {
                    const newEvent = new Event()
                    const eventDate = new Date(arr[idx].start_date).getDate()
                    const eventendDate = new Date(arr[idx].end_date).getDate()
                    console.log("name",arr[idx].event_name)
                    console.log("date",eventDate)
                    console.log("endDate",eventendDate)
                    newEvent.start_date = new Date(arr[idx].start_date.setDate(eventDate + diffDays))
                    newEvent.end_date = new Date(arr[idx].end_date.setDate(eventendDate + diffDaysEnd))
                    await this.eventRepository.update(arr[idx].id, newEvent)
                }
            })
        } else {
            const newEvent = new Event()
                const change_date = new Date(event.start_date)
                const old_date = new Date(eventData.start_date)
                let diffTime = (change_date.getTime() - old_date.getTime());
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const changeEnd_date = new Date(event.end_date)
                const oldEnd_date = new Date(eventData.end_date)
                let diffEndTime = (changeEnd_date.getTime() - oldEnd_date.getTime());
                let diffEndDays = Math.ceil(diffEndTime / (1000 * 60 * 60 * 24));
                const start = eventData.start_date.getDate()
                const end = eventData.end_date.getDate()
                if(diffDays && diffEndDays){
                    console.log("diffDays and endDays")
                    newEvent.start_date = new Date(eventData.start_date.setDate(start + diffDays))
                    newEvent.end_date = new Date(eventData.end_date.setDate(end + diffEndDays))
                }
                if(diffDays && !diffDaysEnd){
                    console.log("diffDays and not endDays")
                    newEvent.start_date = new Date(eventData.start_date.setDate(start + diffDays))
                    newEvent.end_date = new Date(eventData.end_date.setDate(end))
                }
                if(!diffDays && diffDaysEnd){
                    console.log("not diffDays and endDays")
                    newEvent.start_date = new Date(eventData.start_date.setDate(start))
                    newEvent.end_date = new Date(eventData.end_date.setDate(end + diffDaysEnd))
                } 
            // }
            newEvent.isOveride = true
            newEvent.event_name = event.event_name
            newEvent.type = event.type
            newEvent.color = event.color
            return this.eventRepository.update(id, newEvent)
        }

    }

    async deleteEvent(id: number) {
        return await this.eventRepository.delete(id)
    }

    async createArr(event: Event[]) {
        const createArr = event.map(async (entity: Event) => {
            entity.id = null
            const newEntity = this.eventRepository.create(entity);
            return this.eventRepository.save(newEntity)
        });

        return Promise.all(createArr)
    }

    async createData(data) {
        return await this.eventRepository.save(data)
    }
}

