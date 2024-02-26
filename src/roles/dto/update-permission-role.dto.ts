import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdatePermissionRoleDto {
  @IsArray()
  @IsNotEmpty()
  permissionIds: string[];
}
