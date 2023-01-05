import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar])],
  providers: [CalendarService],
  controllers: [CalendarController]

})
export class CalendarModule {}
