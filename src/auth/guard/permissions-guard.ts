import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userPermissions = req?.user?.payload.permissions || [];
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (requiredPermissions.length && hasAllRequiredPermissions) {
      return true;
    }
    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
