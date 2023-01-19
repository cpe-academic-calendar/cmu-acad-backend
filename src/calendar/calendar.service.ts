import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { escapeRegExp } from 'lodash'

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
    ) { }

    async createCalendar(calendar: Calendar) {
        console.log(calendar)
        return this.calendarRepository.save(calendar)
    }

    async findAll() {
        return this.calendarRepository.find()
    }

    async findById(id: number) {
        console.log(id)
        return await this.calendarRepository.findOneBy({ id})
    }

    async sortByDate(queryType) {
        return await this.calendarRepository.find({
            order: {
                'create_at': `${queryType}`
            }
        })
    }

    async findByName(query) {
        return await this.calendarRepository.find({
            where: {
                'name' : ILike(`%${query}%`)
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

    async softDelete(id: number) {
        return await this.calendarRepository.softDelete(id)
    }

    async resotreDelete(id: number) {
        return await this.calendarRepository.restore(id)
    }

    async duplicateCalendar() {
        return await this.calendarRepository.create()
    }
}

