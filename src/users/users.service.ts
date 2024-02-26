import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { roles: roleIds, ...userData } = createUserDto;
    const salt = 10;
    const hashPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashPassword;
    const user = this.userRepository.create(userData);
    if (roleIds && roleIds.length > 0) {
      const roles: Role[] = [];
      for (const roleId of roleIds) {
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId.toString(),
          },
        });
        if (role) {
          roles.push(role);
        }
      }
      user.roles = roles;
    }
    return this.userRepository.save(user);
  }

  async getAllUsers(pageSize: number = 10, pageNumber: number = 1) {
    const offset = (pageNumber - 1) * pageSize;
    const users = await this.userRepository.find({
      take: pageSize,
      skip: offset,
    });
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }

  async deleteById(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return null;
    }
    await this.userRepository.remove(user);
    return user;
  }
  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { roleIds } = updateUserRoleDto;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });
    if (user) {
      const roles: Role[] = [];
      for (const roleId of roleIds) {
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId,
          },
        });
        if (role) {
          roles.push(role);
        }
      }
      user.roles = roles;
      return await this.userRepository.save(user);
    } else {
      return new NotFoundException(`User with id ${userId} not found`);
    }
  }
  async getRolesByUserId(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['roles'],
    });
    if (user) {
      return user.roles;
    }
    throw new NotFoundException(`User with id ${id} not found`);
  }
}
