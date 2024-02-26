import { Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from 'src/roles/entities/role.entity';
import Permission from './entities/permission.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guard/permissions-guard';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['create:permissions'])
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:permissions'])
  async findAll() {
    const permissions = await this.permissionRepository.find();
    return await permissions;
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:permissions'])
  async findOne(id: string) {
    return await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['update:permissions'])
  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(id, updatePermissionDto);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['delete:permissions'])
  async remove(id: string) {
    return await this.permissionRepository.delete(id);
  }
  async getPermissionByRolesName(roles: string[]) {
    const permissions = [];

    for (const roleName of roles) {
      const role = await this.roleRepository.findOne({
        where: { name: roleName },
        relations: ['permissions'],
      });

      if (role) {
        permissions.push(...role.permissions);
      }
    }
    return permissions.map((permission) => permission.name);
  }
}
