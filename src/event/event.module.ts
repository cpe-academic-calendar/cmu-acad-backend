import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { HolidayMock } from './holidaymockup.entity';
import { EventMock } from './eventmockup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),
            TypeOrmModule.forFeature([HolidayMock]),
            TypeOrmModule.forFeature([EventMock])
],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
