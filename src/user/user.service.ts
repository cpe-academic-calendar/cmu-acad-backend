import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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

    async setPermission(id){
        
    }

}
