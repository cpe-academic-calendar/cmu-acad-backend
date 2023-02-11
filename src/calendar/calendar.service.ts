import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { Event } from 'src/event/event.entity';
import { EventType } from 'src/event/enum';
import { EventModule } from 'src/event/event.module';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>
    ) { }

    async createCalendar(calendar: Calendar, event: any) {
        const calendarData = this.calendarRepository.create(calendar)
        await this.calendarRepository.save(calendarData)
        const eventData = this.eventRepository.create(event)
        await this.eventRepository.save(eventData)
        calendarData.events = [...eventData]
        return await this.calendarRepository.save(calendarData)

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

    // async find(event){
    //     return this.calendarRepository.find({where:  {event}})
    // }

    async findById(id) {
        const item = await this.calendarRepository.findOneBy({ id: id })
        console.log(item)
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

