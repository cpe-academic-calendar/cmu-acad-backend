import { Controller, Get, Query,Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { ApiTags } from '@nestjs/swagger/dist';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PermissionService } from 'src/permission/permission.service';
import { UserService } from 'src/user/user.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthenController {

    constructor(
        private readonly httpService: HttpService,
        private readonly permissionService: PermissionService,
        private readonly userService: UserService
    ) { }

    @Get('')
    async find(@Query() code, @Res() res) {
        return await res.redirect(`https://cmu-acad.netlify.app/auth/code?code=${code.code}`)
    }

    @Get('/code')
    async accessToken(@Query() code, @Res() res) {
        return this.httpService.post(`https://oauth.cmu.ac.th/v1/GetToken.aspx?code=${code.code}&redirect_uri=https://cmu-acad.netlify.app/auth/code&client_id=MgtZS8S3J9cAhGAUGhbdX9qFHR2mCySSG7pNHbW8&client_secret=CrJbXxZyb2b5YBhM3YsbfEAkux4ktYkExdNFBpUk&grant_type=authorization_code`).pipe(
            map(response => res.redirect(`https://cmu-acad.netlify.app/auth/login?token=${response.data.access_token}`)))
    }

    @Get('/login')
    async loginCmu(@Query() token, @Res() res) {
        try {
            const response = await this.httpService.get(`https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            }
            ).toPromise();
            const user = await this.permissionService.findAcessUser(response.data.cmuitaccount)
            if (user.length != 0) {
                res.redirect(`https://cmu-acad.netlify.app/token=${token.token}`);
                return this.userService.saveData(response.data)
            } else {
                console.log('You dont have permission to access!!')
                throw new UnauthorizedException('You dont have permission to access!!')
            }

        } catch (error) {
        }
    }

}