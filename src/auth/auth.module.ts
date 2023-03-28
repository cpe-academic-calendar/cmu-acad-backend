import { Module } from "@nestjs/common";
import { AuthenController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from '@nestjs/axios'
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionSchema } from "src/permission/permission.entity";
import { PermissionModule } from "src/permission/permission.module";
@Module({
    imports: [HttpModule, UserModule, TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([PermissionSchema]),
        PermissionModule
        ],
    providers: [AuthService, UserService],
    controllers: [AuthenController]
})

export class AuthenModule { }