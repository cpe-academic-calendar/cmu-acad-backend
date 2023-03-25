import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, PermissionDto, RemovePermissionDto } from './permission.dto';
import { PermissionService } from './permission.service';


@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService) { }
    
    @Get('findAll')
    async findAll(){
        return await this.permissionService.findAll()
    }

    @Get('getAccessUser/:cmuitaccount')
    async getAcessUser(@Param() cmuaccount: CreatePermissionDto) {
        return await this.permissionService.findAcessUser(cmuaccount.cmuitaccount)
    }

    @Post('setEdit')
    async setEdit(@Body() user: CreatePermissionDto) {
        return await this.permissionService.setEdit(user)
    }

    @Delete('removePermission/:id')
    async removePermission(@Param() user: RemovePermissionDto) {
        return await this.permissionService.removeAccesUser(user.id)
    }

}
