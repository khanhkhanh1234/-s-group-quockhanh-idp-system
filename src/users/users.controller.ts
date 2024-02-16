import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.createUser(createUserDto);
    return newUser;
  }

  @Get()
  async getAllUsers(pageNumber, pageSize): Promise<User[]> {
    const users = await this.usersService.getAllUsers(pageNumber, pageSize);
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.getUserById(id);
    return user;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.deleteById(id);
    return user;
  }
}
