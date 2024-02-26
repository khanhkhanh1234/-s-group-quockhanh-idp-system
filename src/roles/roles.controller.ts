import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdatePermissionRoleDto } from './dto/update-permission-role.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guard/permissions-guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['create:roles'])
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  findAll() {
    return this.rolesService.findAll();
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['read:roles'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['update:roles'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SetMetadata('permissions', ['delete:roles'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/permissions')
  updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionRoleDto,
  ) {
    return this.rolesService.updatePermissions(id, updatePermissionDto);
  }
}
