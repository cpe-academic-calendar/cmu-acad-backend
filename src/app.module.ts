import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Calendar } from './calendar/calendar.entity';
import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';
import { AuthenModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database-1.ceeoyl6azozm.ap-northeast-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'acad.1234',
      database: 'cmu_acad',
      entities: [Calendar,Event],
      synchronize: true,
      autoLoadEntities: true
    }),
    CalendarModule,
    EventModule,
    AuthenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
