import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService{
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ){}

    async validateUser(name){
        const user = await this.userService.findByName(name)
        if(user){
            return user
        }
        return null
    }
}