import { Controller, Get, Query,Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { ApiTags } from '@nestjs/swagger/dist';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PermissionService } from 'src/permission/permission.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';


@ApiTags('Auth')
@Controller('auth')
export class AuthenController {

    constructor(
        private readonly httpService: HttpService,
        private readonly permissionService: PermissionService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) { }

    @Get('')
    async find(@Query() code, @Res() res) {
        console.log("get")
        return await res.redirect(`${this.configService.get('auth.auth_path')}=${code.code}`)
    }

    @Get('/code')
    async accessToken(@Query() code, @Res() res) {
        console.log("code")
        return this.httpService.post(`${this.configService.get('auth.oauth_path')}=${code.code}&redirect_uri=${this.configService.get('authen.auth_path')}&client_id=${this.configService.get('authen.client_id')}&client_secret=${this.configService.get('authen.client_secret')}&grant_type=${this.configService.get('authen.grant_type')}`).pipe(
            map(response => res.redirect(`${this.configService.get('authen.railway_url')}/auth/login?token=${response.data.access_token}`)))
    }

    @Get('/login')
    async loginCmu(@Query() token, @Res() res) {
        console.log("login")
        try {
            const response = await this.httpService.get(`${this.configService.get('authen.misapi_url')}`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            }
            ).toPromise();
            const user = await this.permissionService.findAcessUser(response.data.cmuitaccount)
            if (user.length != 0) {
                res.redirect(`${this.configService.get('authen.netlify_url')}token=${token.token}`);
                return this.userService.saveData(response.data)
            } else {
                console.log('You dont have permission to access!!')
                throw new UnauthorizedException('You dont have permission to access!!')
            }

        } catch (error) {
        }
    }

}