import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { Event } from 'src/event/event.entity';
import { EventType } from 'src/asset/enum';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(Event) private readonly eventRepository: Repository<Event>
    ) { }

    async createCalendar(calendar: Calendar, event: any) {
        const calendarData = this.calendarRepository.create(calendar)
        this.calendarRepository.save(calendarData) 
        await this.eventRepository.save(event)
        calendarData.events = [...event]
        return await this.calendarRepository.save(calendarData)

    }

    async findEventById(calendar_id){
        return await this.calendarRepository.find({
            relations: ['events'],
            select:{
                events:{
                    event_name: true,
                    start_date: true,
                    id: true,
                    type: true
                }
            },
            where:{
                id: calendar_id
            }
        })
    }


    async  findHolidayEvent(calendar_id: number){
        return  await this.calendarRepository.find({
            relations: ['events'],
            select:{
                events:{
                    event_name: true,
                    start_date: true,
                    id: true,
                }
            },
            where:{
                id: calendar_id,
                events:{
                    "type": EventType.holiday
                }
            }
                        
                    
        })
    }

    async  findEventType(){
        return  await this.calendarRepository.find({
            relations: ['events'],
            where:{
                events:{
                    "type": EventType.event
                }
            }
                        
                    
        })
    }

    async findEvent(){
        return await this.calendarRepository.find({relations: ['event']})
    }

    async duplicateCalendar(calendar: Calendar) {
        return await this.calendarRepository.save(calendar)
    }

    async findAll() {
        return this.calendarRepository.find({
            // relations:['events'],
            // relations:['events'],
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

