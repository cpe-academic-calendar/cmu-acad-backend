import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { Event } from 'src/event/event.entity';
import { EventType } from 'src/asset/enum';
import { EventService } from 'src/event/event.service';
import *  as fs from 'fs'
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
        @Inject(EventService) private readonly eventService: EventService
    ) { }

    async createCalendar(calendar: Calendar) {
            const data = fs.readFileSync(process.cwd() + '/src/asset/holiday.json', 'utf-8')
            const jsonData = JSON.parse(data)
            const eventData = await this.eventService.autoGenerate(calendar.start_semester)
            let arr = []
            const calendarData = await this.calendarRepository.create(calendar)
            await Promise.all(eventData.map(async (ev) => {
                ev.id = null;
                arr.push(ev)
            }));
            await jsonData.map((data, idx) => {
                const setYear = new Date(calendar.start_semester).getFullYear()
                const setDate = (a) => {
                    return new Date(jsonData[idx].start_date).setFullYear(a)
                }
                const setEventName = (b) => {
                    return `${jsonData[idx].event_name} ${(new Date(b).getFullYear()) + 543}`
                }
                if (jsonData[idx].isNextYear == true) {
                    const year = setDate(setYear + 1)
                    jsonData[idx].start_date = new Date(year)
                    jsonData[idx].end_date = new Date(year)
                    jsonData[idx].event_name = setEventName(year)
                } else {
                    const year = setDate(setYear)
                    jsonData[idx].start_date = new Date(year)
                    jsonData[idx].end_date = new Date(year)
                    jsonData[idx].event_name = setEventName(year)
                }
                arr.push(jsonData[idx])
            })
            await this.eventRepository.insert(arr)
            calendarData.events = [...arr]
            return await this.calendarRepository.save(calendarData)
    }

    async findEventById(calendar_id) {
        return await this.calendarRepository.find({
            relations: ['events'],
            select: {
                events: {
                    event_name: true,
                    start_date: true,
                    id: true,
                    type: true
                }
            },
            where: {
                id: calendar_id
            }
        })
    }



    async findHolidayEvent(calendar_id: number) {
        return await this.calendarRepository.find({
            relations: ['events'],
            select: {
                events: {
                    event_name: true,
                    start_date: true,
                }
            },
            where: {
                id: calendar_id,
                events: {
                    "type": EventType.holiday
                }
            }
        })
    }

    async findEventType(calendar_id) {
        return await this.calendarRepository.find({
            relations: ['events'],
            select: {
                events: {
                    event_name: true,
                    start_date: true,
                    end_date: true
                }
            },
            where: {
                id: calendar_id,
            }
        })
    }

    async findEvent(id) {
        return await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        type: '?????????????????????'
                    },
                    {
                        type: '?????????????????????????????????????????????'
                    }
                ]
            },
            relations: ['events']
        })
    }

    async duplicateCalendar(calendar: Calendar) {
        return await this.calendarRepository.save(calendar)
    }

    async findAll() {
        return this.calendarRepository.find({
            where: {
                'calendar_status': 'Active'

            }
        })
    }

    async findById(id) {
        return await this.calendarRepository.findOneBy({ id: id })
    }

    async sortByDate(queryType) {
        return await this.calendarRepository.find({
            order: {
                'create_at': `${queryType}`
            }
        })
    }

    async findArchive() {
        return await this.calendarRepository.find({
            where: {
                'calendar_status': 'Archive'
            }
        })
    }

    async findByName(query) {
        return await this.calendarRepository.find({
            where: {
                'name': ILike(`%${query}%`)
            }
        })
    }

    async findDelete(id) {
        return await this.calendarRepository.find({ where: { id }, withDeleted: true })
    }

    async changeStatus(id: number, calendar: Calendar) {
        return await this.calendarRepository.update(id, calendar)
    }
    async update(id: number, calendar: Calendar) {
        return await this.calendarRepository.update(id, calendar)
    }

    async deleteCalendar(id: number) {
        return await this.calendarRepository.delete(id)
    }

    async softDelete(id: number[]) {
        return await this.calendarRepository.softDelete(id)
    }

    async restoreDelete(id: number) {
        return await this.calendarRepository.restore(id)
    }
}

