import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { Event } from 'src/event/event.entity';
import { EventType } from 'src/asset/enum';
import { EventService } from 'src/event/event.service';
import *  as fs from 'fs'
import { Inject } from '@nestjs/common/decorators';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp'
import { writeFile } from 'fs/promises';


@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
        @Inject(EventService) private readonly eventService: EventService
    ) { }

    async createCalendar(calendar: Calendar) {
<<<<<<< HEAD
        const data = fs.readFileSync(process.cwd() + '/src/asset/holiday.json', 'utf-8')
        const jsonData = JSON.parse(data)
        const eventData = await this.eventService.autoGenerate(calendar.start_semester)
        let arr = []
        const calendarData = await this.calendarRepository.create(calendar)
        await Promise.all(eventData.map(async (ev) => {
            ev.id = null;
            if (ev.isSetYear == true) {
                ev.event_name = `${ev.event_name} ${(new Date(calendar.start_semester).getFullYear() + 543) - 2500}`
            } else {
                ev.event_name = ev.event_name
            }
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
=======
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
>>>>>>> 36127f4 (fix: invalid date)
    }

    async findByStatus(calendarStatus){
        return await this.calendarRepository.find({
            where:{
                calendar_status: calendarStatus
            }
        })
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
                        type: 'กิจกรรม'
                    },
                    {
                        type: 'วันเปิดภาคเรียน'
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

    async exportEventData(id) {
        const data = await this.calendarRepository.find({
            select: {
                events: {
                    event_name: true,
                    start_date: true,
                    end_date: true
                }
            },
            where: {
                id: id,
                events: [
                    {
                        type: 'กิจกรรม'
                    },
                    {
                        type: 'วันเปิดภาคเรียน'
                    }
                ]
            },
            relations: ['events']
        })
        if (!data[0].events) {
            throw new NotFoundException("No data to download.")
        }

        let rows = []
        let arr = []

        data[0].events.forEach(doc => {
            arr.push(doc)
        })
        const newData = arr.map(idx => {
            idx.event_name = idx.event_name
            idx.start_date = new Date(idx.start_date).toLocaleDateString('th-TH',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            }),
            idx.end_date = new Date(idx.end_date).toLocaleDateString('th-TH',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            })
        })
        arr.forEach(doc=>{
            rows.push(Object.values(doc))
        })

    

        let book = new Workbook();

        let sheet = book.addWorksheet(`ร่างปฏิทิน`)

        let label = [
            "ชื่อปฏิทิน",
            "เริ่มต้น",
            "สิ้นสุด"
        ]

        rows.unshift(label)

        sheet.addRows(rows)
        sheet.getColumn(1).width = 100
        sheet.getColumn(2).width = 30
        sheet.getColumn(3).width = 30

        let File = await new Promise((resolve, reject) => {
            tmp.file({ discardDescriptor: true, prefix: 'ร่างปฏิทิน', postfix: '.xlsx' },
                async (err, file) => {
                    if (err)
                        throw new BadRequestException(err);
                    book.xlsx.writeFile(file).then(_ => {
                        resolve(file)
                    }).catch(err => {
                        throw new BadRequestException(err)
                    })
                }
            )
        })

        return File;
    }

    async exportHolidayData(id){
        const data = await this.calendarRepository.find({
            select: {
                events: {
                    event_name: true,
                    start_date: true,
                }
            },
            where: {
                id: id,
                events: [
                    {
                        type: 'วันหยุด'
                    }
                ]
            },
            relations: ['events']
        })
        if (!data[0].events) {
            throw new NotFoundException("No data to download.")
        }

        let rows = []
        let arr = []

        data[0].events.forEach(doc => {
            arr.push(doc)
        })

        arr.map(idx => {
            idx.event_name = idx.event_name
            idx.start_date = new Date(idx.start_date).toLocaleDateString('th-TH',{
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            })
        })
        arr.forEach(doc=>{
            rows.push(Object.values(doc))
        })

    

        let book = new Workbook();

        let sheet = book.addWorksheet(`สรุปวันหยุด`)

        let label = [
            "ชื่อวันหยุด",
            "วันที่"
        ]

        rows.unshift(label)

        sheet.addRows(rows)

        let File = await new Promise((resolve, reject) => {
            tmp.file({ discardDescriptor: true, prefix: 'สรุปวันหยุด', postfix: '.xlsx' },
                async (err, file) => {
                    if (err)
                        throw new BadRequestException(err);
                    book.xlsx.writeFile(file).then(_ => {
                        resolve(file)
                    }).catch(err => {
                        throw new BadRequestException(err)
                    })
                }
            )
        })

        return File;

    }
}

