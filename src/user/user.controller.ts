import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryUserDto, UserDto, UserIdDto } from './user.dto';
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

    @Get('/:_id')
    async findById(@Param() id: UserIdDto){
        return await this.userService.findById(id._id)
    }

    @Get('findByName/:cmuitaccount')
    async findByName(@Param() account: QueryUserDto){
        return await this.userService.findByName(account.cmuitaccount)
    }

    @Put('update/:_id')
    async updateUser(@Param() user: UserIdDto,@Body() info: UserDto){
        return await this.userService.updateUser(user._id,info)
    }

    @Put('setRole/:id')
    async changeRole(@Param() user: UserIdDto,@Body() role: User){
        return await this.userService.setRole(user._id,role)
    }

}
