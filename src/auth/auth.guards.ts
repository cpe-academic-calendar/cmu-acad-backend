import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PermissionService } from 'src/permission/permission.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CustomLocalAuthGuard extends AuthGuard('local') {
    constructor(private readonly permissionService: PermissionService){
        super();
    }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const headerValue = request.headers['validate-header'];
    console.log(headerValue)
    // You can perform additional header validation here if needed
    if (!headerValue) {
        throw new UnauthorizedException('Missing required header');
      }
    return super.canActivate(context);
  }
}

