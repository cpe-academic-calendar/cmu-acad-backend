import { Module } from "@nestjs/common";
import { AuthenController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from '@nestjs/axios'
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from '@nestjs/jwt';
import { PermissionSchema } from "src/permission/permission.entity";
import { PermissionModule } from "src/permission/permission.module";
import { RoleGuard } from "./roles.guard";
@Module({
    imports: [HttpModule, UserModule, TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([PermissionSchema]),
    JwtModule.register({
            secret: process.env.SECRET,
            signOptions: { expiresIn: '60s' },
        }),
        PermissionModule,
    ],
    providers: [AuthService, UserService],
    controllers: [AuthenController]
})

export class AuthenModule { }