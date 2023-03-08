import { Body, Controller, Delete, Get, Param, Post, Put, Query, Redirect, Res } from '@nestjs/common';
import { AuthenService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { Code } from 'typeorm';
import { map } from 'rxjs';


@Controller('auth')
export class AuthenController {

    constructor(
        private readonly httpService: HttpService
    ) { }

    @Get('')
    async find(@Query() auth_code,@Res() res){
        return res.redirect(`https://cmu-acad-backend-production.up.railway.app/auth/code?auth_code=${auth_code.code}`)
    }

    @Get('/code')
    async accessToken(@Query() code,@Res() res){
        console.log(code.auth_code)
        return this.httpService.post(`https://oauth.cmu.ac.th/v1/GetToken.aspx?code=${code.auth_code}&redirect_uri=https://cmu-acad-backend-production.up.railway.app/auth/login&client_id=MgtZS8S3J9cAhGAUGhbdX9qFHR2mCySSG7pNHbW8&client_secret=CrJbXxZyb2b5YBhM3YsbfEAkux4ktYkExdNFBpUk&grant_type=authorization_code`).pipe(
            map(response => res.redirect(`http://localhost:3000?oauth=${response.data.access_token}`))
        )
        
    }

    @Get('/login')
    async loginCmu(@Query() token){
        return this.httpService.get(`https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo`,{
            headers:{
                'Authorization' : `Bearer ${token.token}`
            }
        }
        ).pipe(map(res => res.data))
    }
    

}