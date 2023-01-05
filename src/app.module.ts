import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarController } from './calendar/calendar.controller';
import { Calendar } from './calendar/calendar.entity';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: './test.sqlite',
        entities: [Calendar],
        synchronize: true
    }),
    CalendarModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
