import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from './permission.entity';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService) { }

    @Get('')
    async findUser(){
        return await this.userService.findAll()
    }

    @Get('/:id')
    async findById(@Param() id){
        return await this.userService.findById(id.id)
    }


    @Get('findByName/:cmuaccount')
    async findByName(@Param() account){
        return await this.userService.findByName(account.cmuaccount)
    }

    @Put('update/:id')
    async updateUser(@Param() user,@Body() info: User){
        return await this.userService.updateUser(user._id,info)
    }

    @Put('setRole/:id')
    async changeRole(@Param() user,@Body() role: User){
        return await this.userService.setRole(user._id,role)
    }

    @Post('setEdit/:id/:calendar_id')
    async setEdit(@Param() user){
        return await this.userService.setEdit(user)
    }

    @Get('findPermission')
    async finPermission(){
        return await this.userService.findPermission()
    }
}
