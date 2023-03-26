import { Injectable } from "@nestjs/common";
import { PermissionService } from "src/permission/permission.service";

@Injectable()
export class AuthService{
    constructor(
        private permissionService: PermissionService
    ){}

    async validateUser(name){
        const user = await this.permissionService.findAcessUser(name)
        if(user){
            return user
        }
        return null
    }
}