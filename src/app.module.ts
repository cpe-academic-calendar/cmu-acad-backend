import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Calendar } from './calendar/calendar.entity';
import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';
import { AuthenModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { PermissionModule } from './permission/permission.module';
import { PermissionSchema } from './permission/permission.entity';
import databaseConfig from './config/database.config';
import authenConfig from './config/authen.config';
import { MockUpEvent } from './event/mockup.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig,authenConfig]
    }),
    TypeOrmModule.forRootAsync({
        useFactory: async (configService: ConfigService)  => ({
          type: 'mysql',
          host: 'database-1.ceeoyl6azozm.ap-northeast-1.rds.amazonaws.com',
          port: 3306,
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          timezone: 'Asia/Bangkok',
          entities: [Calendar,Event,User,PermissionSchema,MockUpEvent],
          synchronize: true,
          autoLoadEntities: true
        }),
        inject: [ConfigService]
    }),
    CalendarModule,
    EventModule,
    AuthenModule,
    UserModule,
    PermissionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {
  constructor(private dataSource: DataSource){}
}
