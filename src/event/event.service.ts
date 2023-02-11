import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from 'src/calendar/calendar.entity';
import { ILike, Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    async createEvent(event){
        return await this.eventRepository.save(event)
    }
    // async getEventByID(id: number){
    //     return await this.eventRepository.findOne(id,{relations: [Calendar]})
    // }
   
}

