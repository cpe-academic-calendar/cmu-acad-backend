import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
        @Inject(JwtService) private readonly jwtService: JwtService
    ) {}

    async saveData(userData) {
            console.log(userData)
            console.log(this.jwtService.sign({
                sub: userData.cmuitaccount
            }))
            return this.jwtService.sign({
                sub: userData.cmuitaccount
            })
            // const username = userData.firstname_EN 
            // const user = await this.userRepository.findOne({
            //     where: {
            //         firstname_EN: username
            //     }
            // })
            
            // if(user){
            //     const data = this.jwtService.sign({
            //         sub: userData.firstname_EN,
            //         email: userData.cmuitaccount
            //     })
            //     return data
            // }else{
            //     await this.userRepository.save(userData)
            //     const data = this.jwtService.sign({
            //         sub: userData.cmuitaccount
            //     })
            //     return   data
            // }
    }

    async findAll(){
        return await this.userRepository.find()
    }

    async findById(id){
        return await this.userRepository.find({
            where:{
                _id: id
            }
        })
    }

    async findByName(name){
        return await this.userRepository.find({
            where: {
                firstname_EN: name
            }
        })
    }

    async updateUser(id,data){
        return await this.userRepository.update(id,data)
    }

    async setRole(id,role){
        return await this.userRepository.update(id,{
            role: `${role}`
        })
    }

    async setEdit(permission){
        return await this.permissionRepository.save(permission)
    }

}
