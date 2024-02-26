import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @IsArray()
  @IsNotEmpty()
  roleIds: string[];
}
