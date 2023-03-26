import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/roles.guard';
import { CreatePermissionDto, RemovePermissionDto } from './permission.dto';
import { PermissionService } from './permission.service';


@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService) { }
    
    @Roles(Role.Admin)
    @UseGuards(RoleGuard)
    @Get('findAll')
    async findAll(){
        return await this.permissionService.findAll()
    }

    @Roles(Role.Admin)
    @UseGuards(RoleGuard)
    @Get('getAccessUser/:cmuitaccount')
    async getAcessUser(@Param() cmuaccount: CreatePermissionDto) {
        return await this.permissionService.findAcessUser(cmuaccount.cmuitaccount)
    }

    @Roles(Role.Admin)
    @UseGuards(RoleGuard)
    @Post('setEdit')
    async setEdit(@Body() user: CreatePermissionDto) {
        return await this.permissionService.setEdit(user)
    }

    @Roles(Role.Admin)
    @UseGuards(RoleGuard)
    @Delete('removePermission/:id')
    async removePermission(@Param() user: RemovePermissionDto) {
        return await this.permissionService.removeAccesUser(user.id)
    }

}
