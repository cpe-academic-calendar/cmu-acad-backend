import { Module } from "@nestjs/common";
import { AuthenController } from "./auth.controller";
import { AuthenService } from "./auth.service";
import { HttpModule } from '@nestjs/axios'

@Module({
    imports:[HttpModule],
    providers:[AuthenService],
    controllers:[AuthenController]
})

export class AuthenModule {}