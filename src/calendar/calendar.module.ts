import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { Event } from 'src/event/event.entity';
import { EventModule } from 'src/event/event.module';
import { EventService } from 'src/event/event.service';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar]),EventModule,
            TypeOrmModule.forFeature([Event]),PermissionModule
],
  providers: [CalendarService,EventService],
  controllers: [CalendarController]

})
export class CalendarModule {}
