import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
    ) {}

    async saveData(userData) {
            const username = userData.firstname_EN 
            const user = await this.userRepository.findOne({
                where: {
                    firstname_EN: username
                }
            })
            if(user){
                return userData
            }else{
                return  await this.userRepository.save(userData)
            }
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