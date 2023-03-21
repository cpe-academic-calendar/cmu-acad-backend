import { Module } from "@nestjs/common";
import { AuthenController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from '@nestjs/axios'
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [HttpModule, UserModule, TypeOrmModule.forFeature([User]),
    JwtModule.register({
            secret: process.env.SECRET,
            signOptions: { expiresIn: '60s' },
        }),],
    providers: [AuthService, UserService],
    controllers: [AuthenController]
})

export class AuthenModule { }