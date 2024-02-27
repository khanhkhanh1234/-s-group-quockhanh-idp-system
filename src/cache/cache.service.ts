import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async cacheUserRolesAndPermissions(token: string) {
    try {
      const userId = await this.usersService.getUserIdFromToken(token);
      const roles = await this.usersService.getRolesByUserId(userId);
      const permissions =
        await this.permissionsService.getPermissionByRolesName(
          roles.map((role) => role.name),
        );
      await this.cacheManager.set(`user:${userId}`, JSON.stringify(userId));
      // Cache roles and permissions
      await this.cacheManager.set(
        `user:${userId}:roles`,
        JSON.stringify(roles),
      );
      await this.cacheManager.set(
        `user:${userId}:permissions`,
        JSON.stringify(permissions),
      );

      console.log(
        `Cached roles and permissions for user ${userId} successfully`,
      );

      // Get cached data
      const cachedRoles = await this.getRolesByUserIdInCache(userId);
      const cachedPermissions =
        await this.getPermissionsByUserIdInCache(userId);

      console.log(`Cached roles for user ${userId}:`, cachedRoles);
      console.log(`Cached permissions for user ${userId}:`, cachedPermissions);
    } catch (error) {
      console.error('Error caching user roles and permissions:', error);
      throw new InternalServerErrorException(
        'Failed to cache user roles and permissions',
      );
    }
  }

  async getRolesByUserIdInCache(userId: string): Promise<any> {
    const key = `user:${userId}:roles`;
    return this.cacheManager.get(key);
  }

  async getPermissionsByUserIdInCache(userId: string): Promise<any> {
    const key = `user:${userId}:permissions`;
    return this.cacheManager.get(key);
  }
}
