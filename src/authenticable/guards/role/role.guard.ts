import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticableService } from 'src/authenticable/authenticable.service';
import { IS_NO_ROLE } from 'src/authenticable/decorators/no-role.decorator';
import { ROLES_KEY } from 'src/authenticable/decorators/roles.decorator';
import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';
import { IS_PUBLIC_KEY } from 'src/reflectors/public.reflector';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isNoRole = this.reflector.getAllAndOverride<boolean>(IS_NO_ROLE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isNoRole) {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride<
      AuthorizationLevel[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.authorization_level == role);
  }
}
