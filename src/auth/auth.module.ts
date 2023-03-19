import { Module } from "@nestjs/common";
import { AuthenController } from "./auth.controller";
import { AuthenService } from "./auth.service";
import { HttpModule } from '@nestjs/axios'
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports:[HttpModule,UserModule,TypeOrmModule.forFeature([User])],
    providers:[AuthenService,UserService],
    controllers:[AuthenController]
})

export class AuthenModule {}