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

    async findEventById(calendar_id) {
        return await this.calendarRepository.find({
            relations: ['events'],
            select: {
                events: {
                    event_name: true,
                    start_date: true,
                    id: true,
                    color: true,
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
                        event_name: ILike(`%วันลงทะเบียน%`)
                    },
                    {
                        event_name: ILike(`วันลงทะเบียนกระบวนวิชานักศึกษาใหม่%`)
                    }, {
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

        for(let i in data[0].events){
            const month = data[0].events[0].start_date.getMonth()
            const date = data[0].events[0].start_date.getDate()
            const end = data[0].events[0].start_date.getDate()
            if (month == 6) {
                if (date <= 7) {
                    setCell(date, end, 'B2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'C2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'D2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'E2')
                }
            }
            if (month == 7) {
                if (date <= 7) {
                    setCell(date, end, 'F2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'G2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'H2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'I2')
                }

            }
            if (month == 8) {
                if (date <= 7) {
                    setCell(date, end, 'J2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'K2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'L2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'M2')
                }
            }
            if (month == 9) {
                if (date <= 7) {
                    setCell(date, end, 'N2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'O2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'P2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'Q2')
                }
            }
            if (month == 10) {
                if (date <= 7) {
                    setCell(date, end, 'R2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'S2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'T2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'U2')
                }
            }
            if (month == 11) {
                if (date <= 7) {
                    setCell(date, end, 'V2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'W2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'X2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'Y2')
                }
            }

            if (month == 12) {
                if (date <= 7) {
                    setCell(date, end, 'Z2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AA2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AB2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'AC2')
                }
            }
            if (month == 1) {
                if (date <= 7) {
                    setCell(date, end, 'AD2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AE2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AF2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'AG2')
                }
            }
            if (month == 2) {
                if (date <= 7) {
                    setCell(date, end, 'AH2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AI2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AJ2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'AK2')
                }
            }

            if (month == 3) {
                if (date <= 7) {
                    setCell(date, end, 'AL2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AM2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AN2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'AO2')
                }
            }
            if (month == 4) {
                if (date <= 7) {
                    setCell(date, end, 'AP2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AQ2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AR2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'AS2')
                }
            }
            if (month == 5) {
                if (date <= 7) {
                    setCell(date, end, 'AT2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AU2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AV2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'AW2')
                }
            }
            if (month == 6) {
                if (date <= 7) {
                    setCell(date, end, 'AX2')
                }
                if (date > 7 && date < 14) {
                    setCell(date, end, 'AY2')
                }
                if (date >= 14 && date < 21) {
                    setCell(date, end, 'AZ2')
                }

                if (date >= 21 && date < 31) {
                    setCell(date, end, 'BA2')
                }
            }
        }




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

        sheet.getCell('A3').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }
        sheet.getCell('A4').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }
        sheet.getCell('A5').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A6').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A7').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A8').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A9').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A10').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A11').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('A1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('B1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('F1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('R1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('V1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('Z1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('J1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('N1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AD1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AH1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

        }
        sheet.getCell('AL1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }
        }
        sheet.getCell('AP1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF7CB0' },
            bgColor: { argb: 'FF7CB0' }

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
}


