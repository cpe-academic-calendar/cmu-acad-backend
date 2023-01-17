import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
    ){}
    
    async createCalendar(calendar: Calendar): Promise<Calendar>{
        return this.calendarRepository.save(calendar)
    }

    async findAll(){
        return this.calendarRepository.find()
    }

    async findById(id){
        return await this.calendarRepository.findOneBy({id : id})
    }

    async findDelete(id){
        return await this.calendarRepository.find({where: {id}, withDeleted: true})
    }

    async changeStatus(id: number,calendar: Calendar){
        return await this.calendarRepository.update(id,calendar)
    }
    async update(id: number, calendar: Calendar){
        return await this.calendarRepository.update(id,calendar)
    }

    async deleteCalendar(id: number){
        return await this.calendarRepository.delete(id)
    }

    async softDelete(id: number){
        return await this.calendarRepository.softDelete(id)
    }

    async resotreDelete(id: number){
        return await this.calendarRepository.restore(id)
    }

    async duplicateCalendar(){
        return await this.calendarRepository.create()
    }
}
