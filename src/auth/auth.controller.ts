import { Controller, Get, Query,Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, tap } from 'rxjs';
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
        return await res.redirect(`${this.configService.get('authen.railway_url')}/auth/code?code=${code.code}`)
    }

    @Get('/code')
    async accessToken(@Query() code, @Res() res) {
        return this.httpService.post(`${this.configService.get('authen.oauth_path')}=${code.code}&redirect_uri=${this.configService.get('authen.railway_url')}/auth/login&client_id=${this.configService.get('authen.client_id')}&client_secret=${this.configService.get('authen.client_secret')}&grant_type=${this.configService.get('authen.grant_type')}`).pipe(
            tap(response => res.redirect(`${this.configService.get('authen.railway_url')}/auth/login?token=${response.data.access_token}`)))
    }

    @Get('/login')
    async loginCmu(@Query() token, @Res() res) {
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
                throw new UnauthorizedException('You dont have permission to access!!')
            }

        } catch (error) {
        }
    }

}