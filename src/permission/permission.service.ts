import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionSchema } from 'src/permission/permission.entity';
import { Repository } from 'typeorm';
import { PermissionDto } from './permission.dto';

@Injectable()
export class PermissionService {

    constructor(
        @InjectRepository(PermissionSchema) private readonly permissionRepository: Repository<PermissionSchema>,
    ) { }

    async setEdit(permission) {
        return await this.permissionRepository.save(permission)
    }

    async removeAccesUser(id) {
        return await this.permissionRepository.delete(id)
    }

    async findAll(){
        return await this.permissionRepository.find()
    }

    async findAcessUser(cmu_info) {
        return await this.permissionRepository.find({
            where: {
                cmuitaccount: cmu_info
            }
        }
        )
    }

    async setRole(id: PermissionDto,role:PermissionDto){
        return await this.permissionRepository.update(id.id,{
            'roles': role.roles
        })
    }


}
