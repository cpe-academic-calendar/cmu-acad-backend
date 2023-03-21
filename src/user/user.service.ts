import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(JwtService) private readonly jwtService: JwtService
    ) { }

    async saveData(userData) {
        const user = await this.userRepository.findOne({
            where: {
                cmuitaccount : userData.cmuitaccount
            }
        })

        if (user) {
            return user
        }else{
            return await this.userRepository.save(userData)
        }

    }

    async findAll() {
        return await this.userRepository.find()
    }

    async findById(id) {
        return await this.userRepository.find({
            where: {
                _id: id
            }
        })
    }

    async findByName(name) {
        return await this.userRepository.find({
            select:[
                '_id'
            ],
            where: {
                cmuitaccount: name
            }
        })
    }

    async updateUser(id, data) {
        return await this.userRepository.update(id, data)
    }

    async setRole(id, role) {
        return await this.userRepository.update(id, {
            role: `${role}`
        })
    }


}
