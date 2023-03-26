import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try{
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest().headers;
      const headers = request['validate-header'];
      const user = await this.permissionService.findAcessUser(headers)
      const hash_Roles = roles.includes(user[0].roles)
      return user && hash_Roles
  
    }catch(error){
    throw new UnauthorizedException()
  }
}
}
