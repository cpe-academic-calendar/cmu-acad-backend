import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import *  as fs from 'fs'

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    async autoGenerate() {
        const data = fs.readFileSync('C:/Users/Jetsa/cmu-acad-backend/src/asset/holiday.json', 'utf-8')
        const dataEvent = fs.readFileSync('c:/Users/Jetsa/cmu-acad-backend/src/asset/event.json', 'utf-8')
        const event = JSON.parse(dataEvent)
        const jsonData = JSON.parse(data)
        let arr = []
        Object.keys(jsonData).forEach((key) => {
            arr.push(jsonData[key])
        })

        Object.keys(event).forEach((key) => {
            console.log(event[key])
        })
        console.log(arr)
    }


    async findAll() {
        return await this.eventRepository.find()
    }

    async createEvent(event) {
        return await this.eventRepository.save(event)
    }

    async getEventByID(id: number) {
        return await this.eventRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async updateEvent(id: number, event: Event) {
        return await this.eventRepository.update(id, event)
    }

    async deleteEvent(id: number) {
        return await this.eventRepository.delete(id)
    }

}

