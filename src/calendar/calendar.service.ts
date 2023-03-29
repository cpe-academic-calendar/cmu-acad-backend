import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { Event } from 'src/event/event.entity';
import { EventType } from 'src/asset/enum';
import { EventService } from 'src/event/event.service';
import *  as fs from 'fs'
import { Inject } from '@nestjs/common/decorators';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp'
import { intervalToDuration } from 'date-fns'

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
        @Inject(EventService) private readonly eventService: EventService
    ) { 
    
    }

    async createCalendar(calendar: Calendar) {
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
            ev.start_date.setUTCHours(0, 0, 0, 0)
            ev.end_date.setUTCHours(0, 0, 0, 0);
            ev.start_date = ev.start_date.toISOString();;
            ev.end_date = ev.end_date.toISOString();;
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

    async updateJsonData(data){
        const jsonContent = JSON.stringify(data)
        return fs.writeFileSync(`${process.cwd()}/src/asset/event.json`,jsonContent)
    }

    async updateHolidayData(data){
        const jsonContent = JSON.stringify(data)
        return fs.writeFileSync(`${process.cwd()}/src/asset/holiday.json`,jsonContent)
    }


    async findByStatus(calendarStatus) {
        return await this.calendarRepository.find({
            where: {
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
                    end_date: true,
                    id: true,
                    color: true,
                    type: true
                }
            },
            where: {
                id: calendar_id,
            }
        })
    }

    async findByQuery(query){
        return await this.calendarRepository.find({
            where:{
                'name': ILike(`%${query}%`),
                
            },
            order:{
                'create_at': `${query.createType}`
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

    async findByName(query, filter) {
        return await this.calendarRepository.find({
            where: {
                'name': ILike(`%${query}%`),
                'calendar_status': `${filter}`
            }
        })

    }

    async findDelete(name) {
        return await this.calendarRepository.find({
            withDeleted: true ,         
            where: {
                'name':  ILike(`%${name}%`),
                },
        })
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

    async softDelete(id: number) {
        return await this.calendarRepository.softDelete(id)
    }

    async restoreDelete(id: number) {
        return await this.calendarRepository.restore(id)
    }


    async exportStudyData(id, dataWeek) {
        const ts1 = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        type: 'วันสอบ'
                    }
                ]
            },
            order: {
                events: {
                    start_date: 'ASC'
                }
            },
            relations: ['events']
        })


        const ex1 = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        event_name: 'วันเปิดภาคเรียน'
                    }, {
                        event_name: 'วันสุดท้ายของการศึกษา'
                    }
                ]
            },
            order:{
                events:{
                    start_date: 'ASC'
                }
            },
            relations: ['events']
        })

        const ex2 = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        event_name: 'วันเปิดภาคเรียน เทอม 2'
                    }, {
                        event_name: 'วันสุดท้ายของการศึกษา เทอม 2'
                    }
                ]
            },
            order:{
                events:{
                    start_date: 'ASC'
                }
            },
            relations: ['events']
        })

        const ex3 = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        event_name: 'วันเปิดภาคเรียน เทอม 3'
                    }, {
                        event_name: 'วันสุดท้ายของการศึกษา เทอม 3'
                    }
                ]
            },
            order:{
                events:{
                    start_date: 'ASC'
                }
            },relations: ['events']
        })

        const holiday = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        start_date: Between(
                            new Date(ex1[0].events[0].start_date),
                            new Date(ex1[0].events[1].start_date)
                        ),
                        type: 'วันหยุด'
                    }
                ]
            }, 
            order:{
                events:{
                    start_date: 'ASC'
                }
            },relations: ['events']
        })

        const holiday2 = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        start_date: Between(
                            new Date(ex2[0].events[0].start_date),
                            new Date(ex2[0].events[1].start_date)
                        ),
                        type: 'วันหยุด'
                    }
                ]
            },
            order:{
                events:{
                    start_date: 'ASC'
                }
            }, relations: ['events']
        })

        const holiday3 = await this.calendarRepository.find({
            where: {
                id: id,
                events: [
                    {
                        start_date: Between(
                            new Date(ex3[0].events[0].start_date),
                            new Date(ex3[0].events[1].start_date)
                        ),
                        type: 'วันหยุด'
                    }
                ]
            },
            order:{
                events:{
                    start_date: 'ASC'
                }
            }, relations: ['events']
        })


        const duration = intervalToDuration({
            start: new Date(ex1[0].events[0].start_date),
            end: new Date(ex1[0].events[1].start_date)
        })

        const duration2 = intervalToDuration({
            start: new Date(ex2[0].events[0].start_date),
            end: new Date(ex2[0].events[1].start_date)
        })

        const duration3 = intervalToDuration({
            start: new Date(ex3[0].events[0].start_date),
            end: new Date(ex3[0].events[1].start_date)
        })

        const studyweek = ((((duration.months * 30) + duration.days) / 7)).toFixed(2)
        const studyweek2 = ((((duration2.months * 30) + duration.days) / 7)).toFixed(2)
        const studyweek3 = ((((duration3.months * 30) + duration.days) / 7)).toFixed(2)

        let book = new Workbook()

        let sheet = book.addWorksheet(`สรุปวันเรียน`)

        sheet.getCell('A1').value = 'ภาคเรียน'
        sheet.getCell('B1').value = 'ช่วงเวลา'
        sheet.getCell('C1').value = 'สัปดาห์'
        sheet.getCell('D1').value = 'สอบกลางภาค/สัปดาห์'
        sheet.getCell('E1').value = 'สอบไล่/สัปดาห์'
        sheet.getCell('F1').value = 'วันจันทร์'
        sheet.getCell('G1').value = 'วันอังคาร'
        sheet.getCell('H1').value = 'วันพุธ'
        sheet.getCell('I1').value = 'วันพฤหัส'
        sheet.getCell('J1').value = 'วันศุกร์'
        sheet.getCell('A2').value = 'ภาคเรียนที่ 1'
        sheet.getCell('A3').value = 'ภาคเรียนที่ 2'
        sheet.getCell('A4').value = 'ภาคฤดูร้อน'
        sheet.getColumn(1).width = 30
        sheet.getColumn(2).width = 20
        sheet.getColumn(3).width = 20
        sheet.getColumn(4).width = 20
        sheet.getColumn(5).width = 15
        sheet.getColumn(6).width = 15
        sheet.getColumn(7).width = 15
        sheet.getColumn(8).width = 15
        sheet.getColumn(9).width = 15
        sheet.getColumn(10).width = 15

        sheet.getCell('B2').value = `${ex1[0].events[0].start_date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        })} -  ${ex1[0].events[1].start_date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        })}  `

        sheet.getCell('B3').value = `${ex2[0].events[0].start_date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        })} -  ${ex1[0].events[1].start_date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        })}  `
        sheet.getCell('B4').value = `${ex3[0].events[0].start_date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        })} -  ${ex3[0].events[1].start_date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        })}  `

        sheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('C2').value = Math.floor(Number(studyweek))
        sheet.getCell('C3').value = Math.floor(Number(studyweek2))
        sheet.getCell('C4').value = Math.floor(Number(studyweek3))
        sheet.getCell('D2').value = Math.floor(Number(ts1[0].events[0].duration_weeks))
        sheet.getCell('D3').value = Math.floor(Number(ts1[0].events[1].duration_weeks))
        sheet.getCell('E2').value = Math.floor(Number(ts1[0].events[2].duration_weeks))
        sheet.getCell('E3').value = Math.floor(Number(ts1[0].events[3].duration_weeks))
        sheet.getCell('E4').value = Math.floor(Number(ts1[0].events[4].duration_weeks))
        sheet.getCell('F2').value = (await dataWeek).term1[0].monday
        sheet.getCell('G2').value = (await dataWeek).term1[0].tuesday
        sheet.getCell('H2').value = (await dataWeek).term1[0].wednesday
        sheet.getCell('I2').value = (await dataWeek).term1[0].thursday
        sheet.getCell('J2').value = (await dataWeek).term1[0].friday
        sheet.getCell('F3').value = (await dataWeek).term2[0].monday
        sheet.getCell('G3').value = (await dataWeek).term2[0].tuesday
        sheet.getCell('H3').value = (await dataWeek).term2[0].wednesday
        sheet.getCell('I3').value = (await dataWeek).term2[0].thursday
        sheet.getCell('J3').value = (await dataWeek).term2[0].friday
        sheet.getCell('F4').value = (await dataWeek).term3[0].monday
        sheet.getCell('E4').value = (await dataWeek).term3[0].tuesday
        sheet.getCell('H4').value = (await dataWeek).term3[0].wednesday
        sheet.getCell('I4').value = (await dataWeek).term3[0].thursday
        sheet.getCell('J4').value = (await dataWeek).term3[0].friday

        sheet.getCell('A6').value = 'วันหยุดของภาคเรียนที่ 1'
        sheet.getCell('B6').value = 'ชื่อวัน'

        sheet.getCell('D6').value = 'วันหยุดของภาคเรียนที่ 2'
        sheet.getCell('E6').value = 'ชื่อวัน'

        sheet.getCell('G6').value = 'วันหยุดของภาคเรียนที่ 3'
        sheet.getCell('H6').value = 'ชื่อวัน'

        for (let i in holiday[0].events) {
            sheet.getCell(`A${7 + Number(i)}`).value = holiday[0].events[i].start_date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            })
            sheet.getCell(`B${Number(7 + Number(i))}`).value = holiday[0].events[i].event_name
        }


        for (let i in holiday2[0].events) {
            sheet.getCell(`D${7 + Number(i)}`).value = holiday2[0].events[i].start_date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            })
            sheet.getCell(`E${Number(7 + Number(i))}`).value = holiday2[0].events[i].event_name
        }

        if (holiday3.length != 0) {
            for (let i in holiday3[0].events) {
                sheet.getCell(`G${7 + Number(i)}`).value = holiday3[0].events[i].start_date.toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                })
                sheet.getCell(`H${Number(7 + Number(i))}`).value = holiday3[0].events[i].event_name
            }
        }





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
                ],
            },
            order:{
                events:{
                    start_date: 'ASC'
                }
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
            idx.start_date = new Date(idx.start_date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            }),
                idx.end_date = new Date(idx.end_date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                })
        })
        arr.forEach(doc => {
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

        sheet.getRow(1).height = 30
        sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('C1').alignment = { horizontal: 'center', vertical: 'middle' };


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

    async exportHolidayData(id) {
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
            order:{
                events:{
                    start_date: 'ASC'
                }
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
            idx.start_date = new Date(idx.start_date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            })
        })
        arr.forEach(doc => {
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
        sheet.getColumn(1).width = 60
        sheet.getColumn(2).width = 30
        sheet.getRow(1).height = 30
        sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };


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

