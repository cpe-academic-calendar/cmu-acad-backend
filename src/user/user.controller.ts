import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('')
    async findUser(){
        return await this.userService.findAll()
    }

    @Get('/:id')
    async findById(@Param() id){
        return await this.userService.findById(id.id)
    }

    @Get('findByName')
    async findByName(@Param() user){
        return await this.userService.findByName(user.firstname_EN)
    }

    @Put('update/:id')
    async updateUser(@Param() user){
        return await this.userService.setPermission(user._id)
    }

}
