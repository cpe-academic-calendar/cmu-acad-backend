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
import { eachDayOfInterval } from 'date-fns'
import { intervalToDuration } from 'date-fns'

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
        calendarData.user_id = calendar.user_id
        calendarData.events = [...arr]
        return await this.calendarRepository.save(calendarData)
    }

    async findByStatus(calendarStatus) {
        return await this.calendarRepository.find({
            where: {
                calendar_status: calendarStatus
            }
        })
    }

    async findEventById(calendar_id,user) {
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
                user_id: user._id
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

    async findAll(user) {
        return this.calendarRepository.find({
            where: {
                'calendar_status': 'Active',
                'user_id': user.user_id
            }
        })
    }

    async findById(id,user) {
        return await this.calendarRepository.findOneBy({ id: id, user_id: user.user_id })
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

    async findByName(query, filter,user) {
        return await this.calendarRepository.find({
            where: {
                'name': ILike(`%${query}%`),
                'calendar_status': `${filter}`,
                'user_id': user.user_id
            }
        })


    }

    async findDelete(id,user) {
        return await this.calendarRepository.find({ where: { id, user_id: user.user_id }, withDeleted: true })
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
            relations: ['events']
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
            }, relations: ['events']
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
            }, relations: ['events']
        })
        console.log(holiday3)


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

        let sheet = book.addWorksheet(`ร่างปฏิทิน`)

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

    async exportDraftCalendar(id) {
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
                        event_name: ILike(`%วันรายงานตัว%`)
                    },
                    {
                        event_name: ILike(`%วันปฐมนิเทศ%`)
                    },
                    {
                        event_name: ILike(`วันลงทะเบียนกระบวนวิชานักศึกษาใหม่%`)
                    },
                    {
                        type: 'วันเปิดภาคเรียน'
                    }, {

                        type: 'ปิดภาคเรียน'
                    }, {
                        type: 'วันสอบ'
                    }, {
                        event_name: ILike(`วันสุดท้ายของการส่งผลการศึกษา%`)
                    },
                    , {
                        event_name: ILike(`วันประมวลผล%`)
                    },
                    , {
                        event_name: ILike(`วันประกาศผลการศึกษา%`)
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

        let book = new Workbook();

        let sheet = book.addWorksheet(`โครงร่างปฏิทิน`)

        console.log(data[0].events.length)


        //วันรายงานตัว 0
        //precollege 1
        //ลงทะเบียน 2
        //เรียน 3
        //สอบกลางภาค 5
        //สอบไล่ 6
        //ส่งผล 8
        //ปรระกาศผล 10

        await this.setcellData(data[0].events[0], sheet, 2)
        await this.setcellData(data[0].events[1], sheet, 3)
        await this.setcellData(data[0].events[2], sheet, 4)
        await this.setcellData(data[0].events[3], sheet, 5)
        await this.setcellData(data[0].events[4], sheet, 5)
        await this.setcellData(data[0].events[5], sheet, 6)
        await this.setcellData(data[0].events[6], sheet, 7)
        await this.setcellData(data[0].events[7], sheet, 5)
        await this.setcellData(data[0].events[8], sheet, 6)


        sheet.getCell('A2').value = 'รายงานตัว'
        sheet.getCell('A3').value = 'pre-college'
        sheet.getCell('A4').value = 'ลงทะเบียน ปี1'
        sheet.getCell('A5').value = 'เวลาเรียน'
        sheet.getCell('A6').value = 'สอบกลางภาค'
        sheet.getCell('A7').value = 'สอบปลายภาค'
        sheet.getCell('A8').value = 'ตรวจข้อสอบ'
        sheet.getCell('A9').value = 'ส่งผลการศึกษา'
        sheet.getCell('A10').value = 'ประมวลผล'
        sheet.getCell('A11').value = 'ประกาศผล'
        sheet.getCell('A1').value = 'กิจกรรม'
        sheet.getCell('B1').value = 'มิ.ย'
        sheet.getCell('F1').value = 'ก.ค.'
        sheet.getCell('J1').value = 'ส.ค.'
        sheet.getCell('N1').value = 'ก.ย.'
        sheet.getCell('R1').value = 'ต.ค.'
        sheet.getCell('V1').value = 'พ.ย.'
        sheet.getCell('Z1').value = 'ธ.ค.'
        sheet.getCell('AD1').value = 'ม.ค.'
        sheet.getCell('AH1').value = 'ก.พ.'
        sheet.getCell('AL1').value = 'มี.ค.'
        sheet.getCell('AP1').value = 'เม.ย.'
        sheet.getCell('AT1').value = 'พ.ค.'
        sheet.getCell('AX1').value = 'มิ.ย.'

        sheet.getCell('A2').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }

        sheet.getCell('A2').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        sheet.getCell('A3').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }

        sheet.getCell('A3').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }


        sheet.getCell('A4').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }

        sheet.getCell('A4').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A5').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A5').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A6').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }

        sheet.getCell('A6').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A7').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }

        sheet.getCell('A7').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A8').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A8').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A9').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A9').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A10').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A10').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A11').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A11').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('A1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('B1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('B1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('F1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('F1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('R1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('R1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('V1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('V1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('Z1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('Z1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('J1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('J1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('N1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('N1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('AD1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AD1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('AH1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AH1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('AL1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }
        sheet.getCell('AL1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('AP1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AP1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('AT1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AT1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
        sheet.getCell('AX1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }
        sheet.getCell('AX1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        sheet.mergeCells('B1: E1')

        sheet.mergeCells('F1: I1')

        sheet.mergeCells('J1: M1')

        sheet.mergeCells('N1: Q1')

        sheet.mergeCells('R1: U1')

        sheet.mergeCells('V1: Y1')

        sheet.mergeCells('Z1: AC1')

        sheet.mergeCells('AD1: AG1')

        sheet.mergeCells('AH1: AK1')

        sheet.mergeCells('AL1: AO1')

        sheet.mergeCells('AP1: AS1')

        sheet.mergeCells('AT1: AW1')

        sheet.mergeCells('AX1: BA1')

        sheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('F1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('J1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('N1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('R1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('V1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('Z1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('AD1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('AH1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('AL1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('AP1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('AT1').alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell('AX1').alignment = { horizontal: 'center', vertical: 'middle' };

        sheet.columns = [
            { width: 15 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 },
            , { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, , { width: 3 }, { width: 3 }, { width: 3 }
            , { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, , { width: 3 }, { width: 3 }, { width: 3 }
            , { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, , { width: 3 }, { width: 3 }, { width: 3 }
            , { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, , { width: 3 }, { width: 3 }, { width: 3 }
            , { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, , { width: 3 }, { width: 3 }, { width: 3 }
            , { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, { width: 3 }, , { width: 3 }, { width: 3 }
        ];

        let File = await new Promise((resolve, reject) => {
            tmp.file({ discardDescriptor: true, prefix: 'สรุปร่างปฏิทิน', postfix: '.xlsx' },
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
        return File

    }

    async setcellData(data, sheet, num) {
        const setCell = (date, end, cell) => {
            if (date == end) {
                sheet.getCell(cell).value = `${date}`
            } else {
                sheet.getCell(cell).value = `${date}-${end}`
            }
            sheet.getCell(cell).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF7CB0' },
                bgColor: { argb: 'FF7CB0' }
            }

        }

        const intervalDay = eachDayOfInterval({
            start: data.start_date,
            end: data.end_date
        })

        for (let i = 0; i < intervalDay.length; i++) {
            const map_month = intervalDay[i].getMonth()
            const interval_date = intervalDay[i].getDate()
            if (map_month == 5) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `B${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `C${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `D${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `E${num}`)
                }
            }
            if (map_month == 6) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `F${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `G${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `H${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `I${num}`)
                }
            }
            if (map_month == 7) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `J${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `K${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `L${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `M${num}`)
                }
            }
            if (map_month == 8) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `N${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `O${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `P${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `Q${num}`)
                }
            }
            if (map_month == 9) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `R${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `S${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `T${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `U${num}`)
                }
            }
            if (map_month == 10) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `V${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `W${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `X${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `Y${num}`)
                }
            }
            if (map_month == 11) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `Z${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AA${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AB${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AC${num}`)
                }
            }
            if (map_month == 12) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `AD${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AE${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AF${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AG${num}`)
                }
            }
            if (map_month == 1) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `AH${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AI${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AJ${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AK${num}`)
                }
            }

            if (map_month == 2) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `AL${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AM${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AN${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AO${num}`)
                }
            }

            if (map_month == 3) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `AP${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AQ${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AR${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AS${num}`)
                }
            }

            if (map_month == 4) {
                if (interval_date < 7) {
                    setCell(interval_date, interval_date, `AT${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AU${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AV${num}`)
                }
                if (interval_date > 7 && interval_date < 14) {
                    setCell(interval_date, interval_date, `AW${num}`)
                }
            }
        }
    }
}


