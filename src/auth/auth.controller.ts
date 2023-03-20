import { Body, Controller, Delete, Get, Param, Post, Put, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { Code } from 'typeorm';
import { map } from 'rxjs';
import { ApiTags } from '@nestjs/swagger/dist';
import { UserService } from 'src/user/user.service';
import { response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthenController {

    constructor(
        private readonly httpService: HttpService,
        private readonly userService: UserService
    ) { }

    @Get('')
    async find(@Query() code,@Res() res){
        return res.redirect(`http://localhost:4000/auth/code?code=${code.code}`)
    }

    @Get('/code')
    async accessToken(@Query() code,@Res() res){
        return this.httpService.post(`https://oauth.cmu.ac.th/v1/GetToken.aspx?code=${code.code}&redirect_uri=http://localhost:4000/auth/login&client_id=MgtZS8S3J9cAhGAUGhbdX9qFHR2mCySSG7pNHbW8&client_secret=CrJbXxZyb2b5YBhM3YsbfEAkux4ktYkExdNFBpUk&grant_type=authorization_code`).pipe(
            map(response => res.redirect(`http://localhost:4000/auth/login?token=${response.data.access_token}`)))
    }

    @Get('/login')
    async loginCmu(@Query() token,@Res() res){
        try{
            const response = await  this.httpService.get(`https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo`,{
                headers:{
                    'Authorization' : `Bearer ${token.token}`
                }
            }
            ).toPromise();
            res.redirect(`http://localhost:3000/token=${token.token}`);
            await this.userService.saveData(response.data)
            
        } catch (error) {
            // handle error
        }
    }
    

}