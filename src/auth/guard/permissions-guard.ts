import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from 'src/cache/cache.service';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req?.user.id;
    console.log('userId', userId);
    const userPermissions =
      await this.cacheService.getPermissionsByUserIdInCache(userId);
    const requiredPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    console.log('requiredPermissions', requiredPermissions);
    console.log('userPermissions', userPermissions);
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
