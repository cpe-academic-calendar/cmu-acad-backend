import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { MockUpEvent } from './mockup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),
            TypeOrmModule.forFeature([MockUpEvent])
],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
